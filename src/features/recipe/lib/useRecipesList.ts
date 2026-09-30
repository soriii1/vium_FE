import { useEffect, useState } from 'react';
import { recipeListCache, RecipeListResult } from './recipeListCache';
import { RecipeCategory } from '../types';

export const useRecipesList = (category: RecipeCategory = '전체') => {
  const [result, setResult] = useState<RecipeListResult | undefined>(() => recipeListCache.getCached(category));
  const [isLoading, setIsLoading] = useState(!result);

  const loadRecipes = async (target: RecipeCategory, force: boolean, isActive: () => boolean = () => true) => {
    const cached = force ? undefined : recipeListCache.getCached(target);
    if (cached) {
      setResult(cached);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const next = await recipeListCache.load(target, force);
    if (!isActive()) return;
    setResult(next);
    setIsLoading(false);
  };

  // 카테고리를 빠르게 바꿀 때 이전 요청 결과가 늦게 도착해 덮어쓰지 않도록 무시
  useEffect(() => {
    let active = true;
    loadRecipes(category, false, () => active);
    return () => {
      active = false;
    };
  }, [category]);

  return {
    recipes: result?.status === 'success' ? result.recipes : [],
    isLoading,
    error: result?.status === 'error' ? result.message : null,
    needsCatalogIngredients: result?.status === 'needsCatalogIngredients',
    refresh: () => loadRecipes(category, true),
  };
};
