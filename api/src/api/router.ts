import {Router} from 'express';
import validate from 'middleware/jwt';
import AuthController from './controller';

// eslint-disable-next-line
const router = Router({mergeParams: true});

router.post(`/signup`, AuthController.signup);

router.post('/login', AuthController.login);

router.get('/protected', validate, AuthController.checkSecret);

export default router;
