import * as argon2 from 'argon2';
import {NextFunction, Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import db from 'services/db';

export const validate = async (
    req: Request, res: Response, next: NextFunction,
) => {
  try {
    const token = req.cookies['entryCookie'];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await db.prisma.user.findFirst(
        {
          where: {
            email: decoded.email,
          },
        },
    );
    if (user && user.jwt_hash) {
      const matching = await argon2.verify(
          user.jwt_hash, `${token}${process.env.PROJECT_PEPPER}`,
      );
      return matching ? next() : res.status(403).end();
    } else {
      res.status(404).end();
    }
    console.log(decoded);
  } catch (error) {
    res.status(403).end();
  }
};

export const authorize = async (
    req: Request, res: Response, next: NextFunction,
) => {
  try {
    const token = req.cookies['secureCookie'];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await db.prisma.user.findFirst(
        {
          where: {
            email: decoded.email,
          },
        },
    );
    if (user && user.jwt_hash) {
      const matching = await argon2.verify(
          user.jwt_hash, `${token}${process.env.PROJECT_PEPPER}`,
      );
      return matching ? next() : res.status(403).end();
    } else {
      res.status(404).end();
    }
    console.log(decoded);
  } catch (error) {
    res.status(403).end();
  }
};

export const authorizeOtp = async (
    req: Request, res: Response, next: NextFunction,
) => {
  try {
    const token = req.cookies['otpCookie'];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await db.prisma.user.findFirst(
        {
          where: {
            email: decoded.email,
          },
        },
    );
    if (user && user.jwt_hash) {
      const matching = await argon2.verify(
          user.jwt_hash, `${token}${process.env.PROJECT_PEPPER}`,
      );
      return matching ? next() : res.status(403).end();
    } else {
      res.status(404).end();
    }
    console.log(decoded);
  } catch (error) {
    res.status(403).end();
  }
};

