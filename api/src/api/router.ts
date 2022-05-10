import {Router} from 'express';
import {validate, authorize} from 'middleware/jwt';
import AuthController from './controller';

// eslint-disable-next-line
const router = Router({mergeParams: true});

router.post(`/signup`, AuthController.signup);

router.post('/login', AuthController.login);

router.get('/protected', validate, AuthController.checkSecret);

router.post('/add-data', authorize, AuthController.addData);

export default router;
