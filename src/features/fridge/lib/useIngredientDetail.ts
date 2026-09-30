import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getIngredients } from '../api/ingredientsApi';
import { mapIngredientToFridgeItem } from './ingredientMapper';
import { FridgeItemDetail, IngredientApiResponse } from '../types';

export const useIngredientDetail = (ingredientId: number) => {
  const [item, setItem] = useState<FridgeItemDetail | null>(null);
  // 수정 화면 초기값용 원본 응답 (포맷 전 날짜/수량, 카탈로그 여부)
  const [ingredient, setIngredient] = useState<IngredientApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadIngredientDetail = useCallback(async () => {
    try {
      // 수정 후 돌아왔을 때처럼 이미 보여준 데이터가 있으면 로딩 화면 없이 갱신
      if (!hasLoaded.current) setIsLoading(true);
      setError(null);

      const response = await getIngredients();

      if (response.success && response.data) {
        const found = response.data.ingredients.find(
          (ing) => ing.inventoryItemId === ingredientId
        );

        if (found) {
          setIngredient(found);
          setItem(mapIngredientToFridgeItem(found));
        } else {
          setError('재료를 찾을 수 없습니다.');
          setIngredient(null);
          setItem(null);
        }
      } else {
        setError(response.error?.message || '재료를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to load ingredient detail:', err);
      setError('서버와 연결할 수 없습니다.');
    } finally {
      hasLoaded.current = true;
      setIsLoading(false);
    }
  }, [ingredientId]);

  // 화면에 다시 들어올 때마다 갱신 (수정 화면에서 돌아온 경우 등)
  useFocusEffect(
    useCallback(() => {
      loadIngredientDetail();
    }, [loadIngredientDetail])
  );

  return {
    item,
    ingredient,
    isLoading,
    error,
    refresh: loadIngredientDetail,
  };
};
