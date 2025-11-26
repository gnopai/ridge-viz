export const staticHeaders = {
  'content-type': 'application/json',
  accept: 'application/json',
};

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.ok) {
    return response.json();
  }
  throw new Error('Backend request failed');
}
