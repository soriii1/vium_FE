import { apiClient } from '@/shared/api/client';
import {
  LoginRequest,
  LoginApiResponse,
  LogoutRequest,
  RegisterRequest,
  RegisterApiResponse,
} from '../types';

export const login = async (request: LoginRequest): Promise<LoginApiResponse> => {
  const response = await apiClient.post<LoginApiResponse>('/api/auth/login', request);
  return response.data;
};

export const logout = async (request: LogoutRequest): Promise<void> => {
  await apiClient.post('/api/auth/logout', request);
};

export const register = async (request: RegisterRequest): Promise<RegisterApiResponse> => {
  const response = await apiClient.post<RegisterApiResponse>('/api/auth/register', request);
  return response.data;
};
