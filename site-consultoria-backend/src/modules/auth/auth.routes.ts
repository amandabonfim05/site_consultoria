import { Router } from 'express';
import { validateBody } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { loginSchema, signUpSchema } from './auth.schemas';
import { login, signUp } from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', validateBody(loginSchema), asyncHandler(login));
authRouter.post('/signup', validateBody(signUpSchema), asyncHandler(signUp));
