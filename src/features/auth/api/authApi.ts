import { apiClient } from '@/shared/api/client';
import { LoginRequest, LoginApiResponse } from '../types';

export const login = async (request: LoginRequest): Promise<LoginApiResponse> => {
  const response = await apiClient.post<LoginApiResponse>('/api/auth/login', request);
  return response.data;
};
