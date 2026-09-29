import { useState } from 'react';
import { useIngredientStatusUpdate } from './useIngredientStatusUpdate';
import { FridgeItem } from '../types';

/**
 * 선택한 재료를 남은 수량 전부 폐기(disposed) 처리
 * 실패한 재료 개수를 반환
 */
export const useIngredientDispose = () => {
  const { updateStatus } = useIngredientStatusUpdate();
  const [isDisposing, setIsDisposing] = useState(false);

  const disposeItems = async (items: FridgeItem[]): Promise<number> => {
    const targets = items.filter((item) => item.remainingQuantity > 0);

    setIsDisposing(true);
    const results = await Promise.all(
      targets.map((item) =>
        updateStatus(item.id, {
          status: 'disposed',
          quantity: item.remainingQuantity,
          wasteQuantity: item.remainingQuantity,
        })
      )
    );
    setIsDisposing(false);

    return results.filter((ok) => !ok).length;
  };

  return {
    disposeItems,
    isDisposing,
  };
};
