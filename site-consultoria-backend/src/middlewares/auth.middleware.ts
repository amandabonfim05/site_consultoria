import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/httpErrors';

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token de acesso ausente.');
  }

  const token = header.replace('Bearer ', '');

  try {
    const payload = verifyToken(token);
    req.consultorId = payload.sub;
    next();
  } catch {
    throw new UnauthorizedError('Token de acesso inválido ou expirado.');
  }
}
