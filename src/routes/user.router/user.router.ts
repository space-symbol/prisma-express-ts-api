import { Router } from 'express';
import UserController from '@controllers/user.controller';
import { authMiddleware } from '@middlewares/auth.middleware';

const userRouter = Router()

userRouter.post('/registration', UserController.registration);
userRouter.post('/login', UserController.login);
userRouter.post('/logout', authMiddleware, UserController.logout);

userRouter.get('/refresh', UserController.refresh);
userRouter.get('/:id?', authMiddleware, UserController.get);
userRouter.delete('/:id?', authMiddleware, UserController.delete)
export default userRouter
