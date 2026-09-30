import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { getRecommendedRecipes } from '../api/recipesApi';
import { mapRecipeCard, toCategoryCode } from './recipeMapper';
import { RecipeCategory, RecipeListItem } from '../types';

const toErrorMessage = (err: unknown) => {
  if (!isAxiosError(err) || !err.response) return '서버와 연결할 수 없습니다.';
  // AI 레시피 생성 실패 (재사용할 레시피도 없는 경우)
  if (err.response.status === 503) return '레시피를 만들지 못했어요. 잠시 후 다시 시도해주세요.';
  return err.response.data?.error?.message || '레시피를 불러오지 못했어요.';
};

export const useRecipesList = (category: RecipeCategory = '전체') => {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = async (target: RecipeCategory, isActive: () => boolean = () => true) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRecommendedRecipes(toCategoryCode(target));
      if (!isActive()) return;
      if (response.success && response.data) {
        setRecipes(response.data.recipes.map(mapRecipeCard));
      } else {
        setError(response.error?.message || '레시피를 불러오지 못했어요.');
      }
    } catch (err) {
      console.error('Failed to load recipes:', err);
      if (isActive()) setError(toErrorMessage(err));
    } finally {
      if (isActive()) setIsLoading(false);
    }
  };

  // 카테고리를 빠르게 바꿀 때 이전 요청 결과가 늦게 도착해 덮어쓰지 않도록 무시
  useEffect(() => {
    let active = true;
    loadRecipes(category, () => active);
    return () => {
      active = false;
    };
  }, [category]);

  return {
    recipes,
    isLoading,
    error,
    refresh: () => loadRecipes(category),
  };
};
