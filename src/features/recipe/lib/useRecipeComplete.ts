import { useState } from 'react';
import { Alert } from 'react-native';
import { isAxiosError } from 'axios';
import { completeRecipe } from '../api/recipesApi';
import { CookUsageItem } from './recipeCookStore';
import { recipeListCache } from './recipeListCache';

/**
 * 요리 완료 — 슬라이더의 남긴 비율(remainingPercent)을 사용 비율(usageRate)로 바꿔 재고에서 차감
 * 냉장고에 없는 재료(inventoryId 없음)는 차감할 재고가 없어 제외
 */
export const useRecipeComplete = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const complete = async (recipeId: number, items: CookUsageItem[]): Promise<boolean> => {
    const usages = items
      .filter((item): item is CookUsageItem & { inventoryId: number } => item.inventoryId != null)
      .map((item) => ({ inventoryId: item.inventoryId, usageRate: 100 - Math.round(item.remainingPercent) }));

    if (usages.length === 0) return true;

    try {
      setIsSubmitting(true);
      await completeRecipe(recipeId, { usages });
      // 재고가 바뀌어 추천 결과도 달라지므로 다음 목록 진입 때 새로 받음
      recipeListCache.invalidate();
      return true;
    } catch (err) {
      console.error('Failed to complete recipe:', err);
      const message =
        isAxiosError(err) && err.response
          ? err.response.data?.error?.message || '재료 사용량을 저장하지 못했어요.'
          : '서버와 연결할 수 없습니다.';
      Alert.alert('오류', message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { complete, isSubmitting };
};
