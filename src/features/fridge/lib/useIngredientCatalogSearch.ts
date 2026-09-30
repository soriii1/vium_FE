import { useEffect, useState } from 'react';
import { searchIngredientCatalog } from '../api/ingredientCatalogApi';
import { IngredientCatalogItem } from '../types';

const SEARCH_DELAY_MS = 300;

/**
 * 재료 이름 입력에 맞춰 카탈로그 후보를 검색 (입력이 멈추면 검색, 늦게 도착한 이전 결과는 무시)
 * @param enabled false면 검색하지 않음 (예: 이미 카탈로그 재료를 고른 경우)
 */
export const useIngredientCatalogSearch = (keyword: string, enabled: boolean = true) => {
  const [items, setItems] = useState<IngredientCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const trimmed = keyword.trim();

  useEffect(() => {
    if (!enabled || !trimmed) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await searchIngredientCatalog(trimmed);
        if (active) setItems(response.success && response.data ? response.data.items : []);
      } catch (err) {
        // 검색 실패 시 후보만 비우고 직접 입력 등록은 그대로 가능
        console.warn('Failed to search ingredient catalog:', err);
        if (active) setItems([]);
      } finally {
        if (active) setIsLoading(false);
      }
    }, SEARCH_DELAY_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [trimmed, enabled]);

  return { items, isLoading };
};
