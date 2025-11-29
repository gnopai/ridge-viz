import type { KernelConfigResponse } from '../types';
import { handleResponse, staticHeaders } from './util';

export const getKernelConfigs = async (): Promise<KernelConfigResponse> => {
  const res = await fetch('/api/kernels', {
    method: 'GET',
    headers: staticHeaders,
  });
  return handleResponse<KernelConfigResponse>(res);
};
