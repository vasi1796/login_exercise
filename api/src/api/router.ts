import {Router} from 'express';
import {validate, authorize, authorizeOtp} from 'middleware/jwt';
import AuthController from './controller';

// eslint-disable-next-line
const router = Router({mergeParams: true});

router.post('/login', AuthController.login);

router.post('/verify-number', authorize, AuthController.verifyNumber);

router.post('/sms-login', authorizeOtp, AuthController.generateLoginSMS);

router.post('/verify-otp', authorizeOtp, AuthController.verifyOtp);

router.get('/logout', AuthController.logout);

router.post(`/signup`, authorize, AuthController.signup);

router.get('/logged-in', validate, AuthController.checkLogin);

router.get('/otp', authorize, AuthController.getOtp);

router.get('/protected', validate, AuthController.checkSecret);

router.post('/add-data', authorize, AuthController.addData);

export default router;
