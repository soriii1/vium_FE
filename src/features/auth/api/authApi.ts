import { apiClient } from '@/shared/api/client';
import { LoginRequest, LoginApiResponse, RegisterRequest, RegisterApiResponse } from '../types';

export const login = async (request: LoginRequest): Promise<LoginApiResponse> => {
  const response = await apiClient.post<LoginApiResponse>('/api/auth/login', request);
  return response.data;
};

export const register = async (request: RegisterRequest): Promise<RegisterApiResponse> => {
  const response = await apiClient.post<RegisterApiResponse>('/api/auth/register', request);
  return response.data;
};
