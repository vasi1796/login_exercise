import express, {Request} from 'express';
import apiRouter from './api/router';
import cookieParser from 'cookie-parser';
import {cors} from 'middleware/cors';
import {redisClient} from 'services/cache';
import * as GoogleStrategy from 'passport-google-oauth2';
import passport from 'passport';

passport.use(new GoogleStrategy.Strategy({
  callbackURL: 'http://localhost:3000/auth/google/callback',
  clientID: process.env.CLIENT_ID as string,
  clientSecret: process.env.CLIENT_SECRET as string,
  passReqToCallback: true,
  scope: ['profile'],
},
(req: Request, accessToken: string,
    refreshToken: string, profile: any, cb: any) => {
  req.body.userProfile = profile;
  cb(null, profile);
},
));

passport.serializeUser((profile, done) => {
  done(null, profile);
});

const app = express();
app.use(cors);
app.use(express.json());
app.use(cookieParser());
app.use(apiRouter);

// eslint-disable-next-line no-unused-vars
const server = app.listen(3000, async () => {
  await redisClient.connect();
  console.log(`
🚀 Server ready at: http://localhost:3000`);
});
