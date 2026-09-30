import { apiClient } from '@/shared/api/client';
import { IngredientCatalogSearchApiResponse } from '../types';

export const searchIngredientCatalog = async (keyword: string): Promise<IngredientCatalogSearchApiResponse> => {
  const response = await apiClient.get<IngredientCatalogSearchApiResponse>('/api/ingredient-catalogs', {
    params: { keyword },
  });
  return response.data;
};
