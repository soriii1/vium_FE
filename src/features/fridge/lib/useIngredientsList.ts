import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getIngredients } from '../api/ingredientsApi';
import { mapIngredientsToFridgeItems } from './ingredientMapper';
import { FridgeItem } from '../types';

export const useIngredientsList = () => {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadIngredients = useCallback(async (expiringSoon: boolean = false) => {
    try {
      // 이미 목록이 있으면 로딩 화면 없이 갱신 (탭 전환·수정 후 복귀 시 깜빡임 방지)
      if (!hasLoaded.current) setIsLoading(true);
      setError(null);
      const response = await getIngredients(expiringSoon);

      if (response.success && response.data) {
        const mappedItems = mapIngredientsToFridgeItems(response.data.ingredients);
        const fridgeItems = mappedItems.map(item => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          status: item.status,
          remainingQuantity: item.remainingQuantity,
        }));
        setItems(fridgeItems);
      } else {
        setError(response.error?.message || '재료를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to load ingredients:', err);
      setError('서버와 연결할 수 없습니다.');
    } finally {
      hasLoaded.current = true;
      setIsLoading(false);
    }
  }, []);

  // 화면에 들어올 때마다 갱신 (등록·수정 화면에서 돌아온 경우 등)
  useFocusEffect(
    useCallback(() => {
      loadIngredients();
    }, [loadIngredients])
  );

  return {
    items,
    isLoading,
    error,
    refresh: loadIngredients,
  };
};
