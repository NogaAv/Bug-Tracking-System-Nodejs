import express from 'express';
import * as userController from '../controllers/user.controller.js';
import authUser from '../middlewares/user.auth.js';

const userRouter = express.Router();

userRouter.post('/user/signup', userController.createUser);
userRouter.patch('/user/login', userController.login);
userRouter.patch('/user/logout', authUser, userController.logout);
userRouter.get('/user/bugs', authUser, userController.getBugs);

export default userRouter;
