import axios, { type AxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: '/backend/v1',
  headers: { 'Content-Type': 'application/json' },
});

type RetryableRequestConfig = AxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(undefined, async (error: unknown) => {
  if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
  const config = error.config as RetryableRequestConfig | undefined;
  if (!config || config._retry || config.url?.includes('/auth/')) throw error;
  config._retry = true;
  await api.post('/auth/refresh');
  return api.request(config);
});
