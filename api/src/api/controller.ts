import {Request, Response} from 'express';
import * as argon2 from 'argon2';
import db from '../services/db';
import * as jwt from 'jsonwebtoken';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import * as crypto from 'crypto';
import {User} from '@prisma/client';
import {client} from '../services/sms';
import {redisClient} from 'services/cache';
import {encrypt} from 'util/util';
class AuthController {
  verifyNumber = async (req: Request, res: Response) => {
    const {email, tel_number} = req.body;
    const generatedNumber = Math.floor(Math.random() * 899999 + 100000);
    // Send sms verification
    await client.messages
        .create({
          body: `Your OTP verification code is ${generatedNumber}`,
          to: `+${tel_number}`,
          from: process.env.TWILIO_NO,
        })
        .then((message) => console.log(message.sid))
        .catch((err) => {
          console.log(err);
          res.status(500).end();
        });
    await redisClient.set(email, `${generatedNumber}`);
    await redisClient.expire(email, 300);
    res.status(200).end();
  };

  signup = async (req: Request, res: Response) => {
    try {
      const {name, email, password,
        base32, otp_token,
        sms_token, tel_number} = req.body;
      let otpVerified: boolean = false;
      let smsVerified: boolean = false;
      let otpIv: string | undefined = undefined;
      let encryptedOtp: string | undefined = undefined;
      let encryptedPhone: string | undefined = undefined;
      let phoneIv: string | undefined = undefined;

      // Verify sms token if exists
      if (sms_token) {
        const smsToken = await redisClient.get(email);
        if (sms_token !== smsToken) throw new Error('SMS OTP not correct');
        smsVerified = true;
        [encryptedPhone, phoneIv] = encrypt(tel_number);
      }

      // Verify secret against user token
      if (otp_token) {
        otpVerified = speakeasy.totp.verify({
          secret: base32,
          encoding: 'base32',
          token: otp_token,
        });
        if (!otpVerified) throw new Error('OTP not verified');

        [encryptedOtp, otpIv] = encrypt(base32);
      }

      // Hash regular password
      const user_password = await argon2.hash(
          `${password}${process.env.PROJECT_PEPPER}`,
      );

      // Store new user
      const result = await db.prisma.user.create({
        data: {
          name,
          email,
          user_password,
          totp_iv: otpVerified ? otpIv : undefined,
          totp: otpVerified ? encryptedOtp : undefined,
          number: smsVerified ? encryptedPhone : undefined,
          number_iv: smsVerified ? phoneIv : undefined,
        },
      });

      // Generate cookies for further requests
      const token = await this.generateToken(result);
      res.status(200)
          .cookie('entryCookie', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 3),
            sameSite: 'lax',
          })
          .cookie('secureCookie', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 3),
            sameSite: 'strict',
          })
          .end();
    } catch (error) {
      console.error(error);
      res.status(403).end();
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    try {
      const {email, password, otp_token} = req.body;
      const result = await db.prisma.user.findFirst({
        where: {email: email},
      });
      if (result) {
        const matches = await argon2.verify(
            result?.user_password, `${password}${process.env.PROJECT_PEPPER}`,
        );
        if (matches) {
        // If OTP enabled decrypt and check
          if (result.totp && result.totp_iv) {
            // Decrypt shared secret
            const algorithm = 'aes-256-cbc';
            const decipher = crypto.createDecipheriv(
                algorithm,
        process.env.TOTP_SECRET as string,
        Buffer.from(result.totp_iv, 'base64'));

            let decryptedOtp = decipher.update(result.totp, 'hex', 'utf-8');
            decryptedOtp += decipher.final('utf8');

            // Validate OTP
            const validated = speakeasy.totp.verify({
              secret: decryptedOtp,
              encoding: 'base32',
              token: otp_token,
            });
            if (!validated) throw new Error('Incorrect OTP');
            const token = await this.generateToken(result);
            return res.status(200)
                .clearCookie('otpCookie')
                .cookie('entryCookie', token, {
                  httpOnly: true,
                  expires: new Date(Date.now() + 1000 * 60 * 3),
                  sameSite: 'lax',
                })
                .cookie('secureCookie', token, {
                  httpOnly: true,
                  expires: new Date(Date.now() + 1000 * 60 * 3),
                  sameSite: 'strict',
                })
                .end();
          }
        }
      }
    } catch (error) {
      return res.status(403).end();
    }
    return res.status(403).end();
  };

  login = async (req: Request, res: Response)=>{
    try {
      const {email, password} = req.body;
      const result = await db.prisma.user.findFirst({
        where: {email: email},
      });
      if (result) {
        const matches = await argon2.verify(
            result?.user_password, `${password}${process.env.PROJECT_PEPPER}`,
        );

        if (matches) {
          if (result.totp && result.totp_iv) {
            const token = await this.generateToken(result);
            return res.status(200)
                .cookie('otpCookie', token, {
                  httpOnly: true,
                  expires: new Date(Date.now() + 1000 * 60 * 3),
                  sameSite: 'strict',
                })
                .json({'otp': true})
                .end();
          }
          const token = await this.generateToken(result);
          return res.status(200)
              .cookie('entryCookie', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 3),
                sameSite: 'lax',
              })
              .cookie('secureCookie', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 3),
                sameSite: 'strict',
              })
              .end();
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(403).end();
    }
    return res.status(403).end();
  };

  logout = async (req: Request, res: Response)=>{
    res.status(200)
        .clearCookie('entryCookie')
        .clearCookie('secureCookie')
        .end();
  };

  getOtp = async (req: Request, res: Response) => {
    const secret = speakeasy.generateSecret();
    if (secret.otpauth_url) {
      qrcode.toDataURL(secret.otpauth_url, (err, qrImage) => {
        if (!err) {
          res.status(200).send({qr: qrImage, secret: secret}).end();
        } else {
          res.status(404).end();
        }
      });
    }
  };

  checkSecret = async (req: Request, res: Response) => {
    res.status(200).end();
  };

  checkLogin = async (req: Request, res: Response) => {
    res.status(200).json({loggedIn: true}).end();
  };

  addData = async (req: Request, res: Response) => {
    res.status(200).end();
  };

  private generateToken = async (user: User): Promise<string> => {
    const token = jwt.sign(
        {
          user_id: user.id,
          email: user.email,
        },
      process.env.JWT_SECRET as string,
    );
    const jwt_hash = await argon2.hash(
        `${token}${process.env.PROJECT_PEPPER}`,
    );
    await db.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        jwt_hash: jwt_hash,
      },
    });
    return token;
  };
}

export default new AuthController();
