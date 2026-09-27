import { useState } from 'react';
import { Alert } from 'react-native';
import { useIngredientStatusUpdate, IngredientStatusUpdateRequest } from '@/features/ingredient';
import { CleanupItem, fridgeCleanupStore } from './fridgeCleanupStore';

/**
 * 슬라이더의 남긴 비율(remainingPercent)을 소진/폐기 요청으로 변환
 * - 0%: 전부 먹음 → consumed
 * - 그 외: 남긴 만큼 버림 → disposed (wasteQuantity = 남은 수량 × 비율)
 */
const toStatusRequest = (item: CleanupItem): IngredientStatusUpdateRequest => {
  if (item.remainingPercent === 0) {
    return { status: 'consumed', quantity: item.remainingQuantity };
  }

  const wasteQuantity = Math.round(item.remainingQuantity * item.remainingPercent) / 100;
  return { status: 'disposed', quantity: item.remainingQuantity, wasteQuantity };
};

export const useFridgeCleanupFinish = () => {
  const { updateStatus } = useIngredientStatusUpdate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모든 재료 처리에 성공하면 true, 하나라도 실패하면 성공한 재료만 store에서 제거하고 false
  const finish = async (): Promise<boolean> => {
    const targets = fridgeCleanupStore.getItems().filter((item) => item.remainingQuantity > 0);

    setIsSubmitting(true);
    const results = await Promise.all(
      targets.map((item) => updateStatus(item.id, toStatusRequest(item)))
    );
    setIsSubmitting(false);

    const failedCount = results.filter((ok) => !ok).length;
    if (failedCount > 0) {
      fridgeCleanupStore.removeItems(targets.filter((_, index) => results[index]).map((item) => item.id));
      Alert.alert('오류', `${failedCount}개 재료를 정리하지 못했습니다. 다시 시도해주세요.`);
      return false;
    }
    return true;
  };

  return {
    finish,
    isSubmitting,
  };
};
