import { Router } from 'express';
import { validateBody } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { contatoSchema } from './contatos.schemas';
import {
  createContato,
  deleteContato,
  getContato,
  listContatos,
  updateContato,
} from './contatos.controller';

export const contatosRouter = Router();

contatosRouter.get('/', asyncHandler(listContatos));
contatosRouter.get('/:id', asyncHandler(getContato));
contatosRouter.post('/', validateBody(contatoSchema), asyncHandler(createContato));
contatosRouter.put('/:id', validateBody(contatoSchema), asyncHandler(updateContato));
contatosRouter.delete('/:id', asyncHandler(deleteContato));
