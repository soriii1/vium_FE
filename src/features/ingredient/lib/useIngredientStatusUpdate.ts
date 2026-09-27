import { useState } from 'react';
import { updateIngredientStatus } from '../api/ingredientsApi';
import { IngredientStatusUpdateRequest } from '../types';

export const useIngredientStatusUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (
    ingredientId: number,
    request: IngredientStatusUpdateRequest
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await updateIngredientStatus(ingredientId, request);

      if (response.success) {
        return true;
      }
      setError(response.error?.message || '재료 상태를 변경하지 못했습니다.');
      return false;
    } catch (err) {
      console.error('Failed to update ingredient status:', err);
      setError('서버와 연결할 수 없습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateStatus,
    isLoading,
    error,
  };
};
