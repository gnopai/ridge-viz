import type { RidgeResponse, RidgeRequest } from '../types';
import { handleResponse, staticHeaders } from './util';

export const requestRidgePlots = async (request: RidgeRequest): Promise<RidgeResponse> => {
   const body = JSON.stringify(request);
   const res = await fetch('/api/ridge', {
     method: 'POST',
     body,
     headers: staticHeaders,
     cache: 'no-store',
   });
   return handleResponse<RidgeResponse>(res);
};
