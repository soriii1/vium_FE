import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { getRecipeDetail } from '../api/recipesApi';
import { mapRecipeDetail } from './recipeMapper';
import { RecipeDetail } from '../types';

export const useRecipeDetail = (recipeId: number) => {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getRecipeDetail(recipeId);
        if (!active) return;
        if (response.success && response.data) {
          setRecipe(mapRecipeDetail(response.data));
        } else {
          setError(response.error?.message || '레시피를 불러오지 못했어요.');
        }
      } catch (err) {
        console.error('Failed to load recipe detail:', err);
        if (!active) return;
        setError(
          isAxiosError(err) && err.response
            ? err.response.data?.error?.message || '레시피를 불러오지 못했어요.'
            : '서버와 연결할 수 없습니다.'
        );
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadRecipe();
    return () => {
      active = false;
    };
  }, [recipeId]);

  return { recipe, isLoading, error };
};
