import {Request, Response} from 'express';
import * as argon2 from 'argon2';
import db from '../services/db';
import * as jwt from 'jsonwebtoken';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import {User} from '@prisma/client';

class AuthController {
  signup = async (req: Request, res: Response) => {
    const {name, email, password, base32, otp_token} = req.body;

    const user_password = await argon2.hash(
        `${password}${process.env.PROJECT_PEPPER}`,
    );

    try {
      const verified = speakeasy.totp.verify({
        secret: base32,
        encoding: 'base32',
        token: otp_token,
      });

      if (verified) {
        const result = await db.prisma.user.create({
          data: {
            name,
            email,
            user_password,
            totp: base32,
          },
        });

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
      } else {
        throw new Error('OTP not verified');
      }
    } catch (error) {
      res.status(403).end();
    }
  };

  login = async (req: Request, res: Response)=>{
    try {
      const {email, password, otp_token} = req.body;
      const result = await db.prisma.user.findFirst({
        where: {email: email},
      });
      if (result) {
        const matches = await argon2.verify(
            result?.user_password, `${password}${process.env.PROJECT_PEPPER}`,
        );

        if (result.totp) {
          const validated = speakeasy.totp.verify({
            secret: result.totp,
            encoding: 'base32',
            token: otp_token,
          });
          if (!validated) throw new Error('Incorrect OTP');
        }

        if (matches) {
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
        }
      }
    } catch (error) {
      res.status(403).end();
      console.log(error);
    }
    res.status(403).end();
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
          res.status(403).end();
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
