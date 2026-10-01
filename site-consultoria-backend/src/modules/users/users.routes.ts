import { Router } from 'express';
import { validateBody } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { userProfileSchema, updateMetaSchema } from './users.schemas';
import { getMe, updateMe, updateMeta } from './users.controller';

export const usersRouter = Router();

usersRouter.get('/me', asyncHandler(getMe));
usersRouter.put('/me', validateBody(userProfileSchema), asyncHandler(updateMe));
usersRouter.put('/me/meta', validateBody(updateMetaSchema), asyncHandler(updateMeta));
