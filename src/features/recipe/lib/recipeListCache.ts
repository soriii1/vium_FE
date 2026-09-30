import { isAxiosError } from 'axios';
import { getRecommendedRecipes } from '../api/recipesApi';
import { mapRecipeCard, toCategoryCode } from './recipeMapper';
import { RecipeCategory, RecipeListItem } from '../types';

/**
 * 추천 레시피 요청 캐시 — 홈·레시피 화면이 같은 결과를 공유
 * 추천은 AI 생성(비용·수 초 소요)이 걸려 있어, 화면에 들어올 때마다 요청하지 않도록 함
 */
const SUCCESS_TTL_MS = 10 * 60 * 1000;
// 실패 직후에는 자동 재요청하지 않음 (다시 시도 버튼은 force로 우회)
const FAILURE_COOLDOWN_MS = 60 * 1000;

export type RecipeListResult =
  | { status: 'success'; recipes: RecipeListItem[] }
  | { status: 'needsCatalogIngredients' }
  | { status: 'error'; message: string };

interface CacheEntry {
  result: RecipeListResult;
  fetchedAt: number;
}

const cache = new Map<RecipeCategory, CacheEntry>();
const inFlight = new Map<RecipeCategory, Promise<RecipeListResult>>();

const toErrorMessage = (err: unknown) => {
  if (!isAxiosError(err) || !err.response) return '서버와 연결할 수 없습니다.';
  // AI 레시피 생성 실패 (재사용할 레시피도 없는 경우)
  if (err.response.status === 503) return '레시피를 만들지 못했어요. 잠시 후 다시 시도해주세요.';
  return err.response.data?.error?.message || '레시피를 불러오지 못했어요.';
};

const request = async (category: RecipeCategory): Promise<RecipeListResult> => {
  try {
    const response = await getRecommendedRecipes(toCategoryCode(category));
    if (response.success && response.data) {
      return { status: 'success', recipes: response.data.recipes.map(mapRecipeCard) };
    }
    return { status: 'error', message: response.error?.message || '레시피를 불러오지 못했어요.' };
  } catch (err) {
    // 카탈로그 재료가 하나도 없어 추천할 수 없는 상태 (오류가 아니라 재료 등록 안내 대상)
    if (isAxiosError(err) && err.response?.data?.error?.code === 'NO_CATALOG_INGREDIENTS') {
      return { status: 'needsCatalogIngredients' };
    }
    console.error('Failed to load recipes:', err);
    return { status: 'error', message: toErrorMessage(err) };
  }
};

const isFresh = (entry: CacheEntry) => {
  const ttl = entry.result.status === 'error' ? FAILURE_COOLDOWN_MS : SUCCESS_TTL_MS;
  return Date.now() - entry.fetchedAt < ttl;
};

export const recipeListCache = {
  getCached: (category: RecipeCategory) => {
    const entry = cache.get(category);
    return entry && isFresh(entry) ? entry.result : undefined;
  },

  load: (category: RecipeCategory, force = false): Promise<RecipeListResult> => {
    if (!force) {
      const cached = recipeListCache.getCached(category);
      if (cached) return Promise.resolve(cached);
    }
    // 이미 같은 요청이 진행 중이면 그 결과를 같이 기다림
    const pending = inFlight.get(category);
    if (pending) return pending;

    const promise = request(category)
      .then((result) => {
        cache.set(category, { result, fetchedAt: Date.now() });
        return result;
      })
      .finally(() => inFlight.delete(category));
    inFlight.set(category, promise);
    return promise;
  },

  // 냉장고 재료가 바뀌어 추천이 달라질 때 호출
  invalidate: () => cache.clear(),
};
