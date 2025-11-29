import type { RidgePlotResponse, RidgePlotRequest } from '../types';
import { handleResponse, staticHeaders } from './util';

export const requestRidgePlot = async (request: RidgePlotRequest): Promise<RidgePlotResponse> => {
  const body = JSON.stringify(request);
  const res = await fetch('/api/ridge', {
    method: 'POST',
    body,
    headers: staticHeaders,
    cache: 'no-store',
  });
  return handleResponse<RidgePlotResponse>(res);
};
