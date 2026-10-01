import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getMetrics } from './dashboard.controller';

export const dashboardRouter = Router();

dashboardRouter.get('/metrics', asyncHandler(getMetrics));
