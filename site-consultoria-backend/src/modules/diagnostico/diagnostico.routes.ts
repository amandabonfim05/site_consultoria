import { Router } from 'express';
import { validateBody } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { enviarDiagnosticoEmailSchema } from './diagnostico.schemas';
import { enviarDiagnosticoEmail } from './diagnostico.controller';

export const diagnosticoRouter = Router();

diagnosticoRouter.post('/email', validateBody(enviarDiagnosticoEmailSchema), asyncHandler(enviarDiagnosticoEmail));
