import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './lib/env';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';
import { authRouter } from './modules/auth/auth.routes';
import { contatosRouter } from './modules/contatos/contatos.routes';
import { usersRouter } from './modules/users/users.routes';
import { dashboardRouter } from './modules/dashboard/dashboard.routes';
import { ligacoesRouter } from './modules/ligacoes/ligacoes.routes';
import { analisesRouter } from './modules/analises/analises.routes';
import { contratosRouter } from './modules/contratos/contratos.routes';
import { diagnosticoRouter } from './modules/diagnostico/diagnostico.routes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: '5mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', authRouter);

  app.use('/contatos', authMiddleware, contatosRouter);
  app.use('/users', authMiddleware, usersRouter);
  app.use('/dashboard', authMiddleware, dashboardRouter);
  app.use('/ligacoes', authMiddleware, ligacoesRouter);
  app.use('/analises', authMiddleware, analisesRouter);
  app.use('/contratos', authMiddleware, contratosRouter);
  app.use('/diagnostico', authMiddleware, diagnosticoRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
