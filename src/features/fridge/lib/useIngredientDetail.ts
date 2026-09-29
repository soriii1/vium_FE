import { useState, useEffect } from 'react';
import { getIngredients } from '../api/ingredientsApi';
import { mapIngredientToFridgeItem } from './ingredientMapper';
import { FridgeItemDetail } from '../types';

export const useIngredientDetail = (ingredientId: number) => {
  const [item, setItem] = useState<FridgeItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIngredientDetail();
  }, [ingredientId]);

  const loadIngredientDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getIngredients();

      if (response.success && response.data) {
        const ingredient = response.data.ingredients.find(
          (ing) => ing.inventoryItemId === ingredientId
        );

        if (ingredient) {
          const mappedItem = mapIngredientToFridgeItem(ingredient);
          setItem(mappedItem);
        } else {
          setError('재료를 찾을 수 없습니다.');
          setItem(null);
        }
      } else {
        setError(response.error?.message || '재료를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to load ingredient detail:', err);
      setError('서버와 연결할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    item,
    isLoading,
    error,
    refresh: loadIngredientDetail,
  };
};
