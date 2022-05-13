import {Request, Response} from 'express';
import * as argon2 from 'argon2';
import db from '../services/db';
import * as jwt from 'jsonwebtoken';
import {User} from '@prisma/client';

class AuthController {
  signup = async (req: Request, res: Response) => {
    const {name, email, password} = req.body;

    const user_password = await argon2.hash(
        `${password}${process.env.PROJECT_PEPPER}`,
    );

    try {
      const result = await db.prisma.user.create({
        data: {
          name,
          email,
          user_password,
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
    } catch (error) {
      res.status(403).end();
    }
  };

  login = async (req: Request, res: Response)=>{
    const {email, password} = req.body;
    const result = await db.prisma.user.findFirst({
      where: {email: email},
    });
    if (result) {
      const matches = await argon2.verify(
          result?.user_password, `${password}${process.env.PROJECT_PEPPER}`,
      );
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
      } else {
        res.status(403).end();
      }
    } else {
      res.status(404).end();
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
