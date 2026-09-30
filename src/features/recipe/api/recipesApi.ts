import { apiClient } from '@/shared/api/client';
import {
  RecipeCategoryCode,
  RecipeCompleteRequest,
  RecipeDetailApiResponse,
  RecommendedRecipesApiResponse,
} from '../types';

export const getRecommendedRecipes = async (
  category: RecipeCategoryCode = 'ALL'
): Promise<RecommendedRecipesApiResponse> => {
  const response = await apiClient.get<RecommendedRecipesApiResponse>('/api/me/recipes/recommended', {
    params: { category },
  });
  return response.data;
};

export const getRecipeDetail = async (recipeId: number): Promise<RecipeDetailApiResponse> => {
  const response = await apiClient.get<RecipeDetailApiResponse>(`/api/me/recipes/${recipeId}`);
  return response.data;
};

export const completeRecipe = async (recipeId: number, request: RecipeCompleteRequest): Promise<void> => {
  await apiClient.post(`/api/me/recipes/${recipeId}/complete`, request);
};
