import { Router } from 'express';
import { validateBody } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { criarContratoSchema } from './contratos.schemas';
import { cancelarContrato, createContrato, getContrato, listContratos } from './contratos.controller';

export const contratosRouter = Router();

contratosRouter.get('/', asyncHandler(listContratos));
contratosRouter.get('/:id', asyncHandler(getContrato));
contratosRouter.post('/', validateBody(criarContratoSchema), asyncHandler(createContrato));
contratosRouter.delete('/:id', asyncHandler(cancelarContrato));
