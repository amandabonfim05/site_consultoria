import { Router } from 'express';
import { validateBody } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { criarAnaliseSchema } from './analises.schemas';
import { createAnalise } from './analises.controller';

export const analisesRouter = Router();

analisesRouter.post('/', validateBody(criarAnaliseSchema), asyncHandler(createAnalise));
