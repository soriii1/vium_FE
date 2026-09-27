import { useState, useEffect } from 'react';
import { getIngredients } from '../api/ingredientsApi';
import { mapIngredientsToFridgeItems } from './ingredientMapper';
import { FridgeItem } from '../types';

export const useIngredientsList = () => {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIngredients = async (expiringSoon: boolean = false) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  return {
    items,
    isLoading,
    error,
    refresh: loadIngredients,
  };
};
