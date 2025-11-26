import type { HealthResponse } from '../types';
import { handleResponse, staticHeaders } from './util';

export const health = async (): Promise<HealthResponse> => {
  const res = await fetch('/api/health', { headers: staticHeaders });
  return handleResponse<HealthResponse>(res);
};
