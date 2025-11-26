import type { RidgePlot } from '../types';
import { handleResponse, staticHeaders } from './util';

export const requestRidgePlot = async (): Promise<RidgePlot> => {
  // TODO const body = JSON.stringify(something);
  const res = await fetch('/api/ridge', {
    method: 'GET', // TODO switch to POST
    // body, TODO
    headers: staticHeaders,
    cache: 'no-store',
  });
  return handleResponse<RidgePlot>(res);
};
