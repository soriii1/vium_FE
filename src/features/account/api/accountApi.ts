import { apiClient } from '@/shared/api/client';
import { MeApiResponse } from '../types';

export const getMe = async (): Promise<MeApiResponse> => {
  const response = await apiClient.get<MeApiResponse>('/api/me');
  return response.data;
};
