import { api } from './api';
import type { DashboardMetrics } from '../types/dashboard';

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data } = await api.get<DashboardMetrics>('/dashboard/metrics');
  return data;
}
