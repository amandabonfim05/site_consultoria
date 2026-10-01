import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { createLigacao } from './ligacoes.controller';

export const ligacoesRouter = Router();

ligacoesRouter.post('/', asyncHandler(createLigacao));
