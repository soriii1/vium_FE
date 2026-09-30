import { useState } from 'react';
import { Alert } from 'react-native';
import { isAxiosError } from 'axios';
import { updateIngredient } from '../api/ingredientsApi';
import { toDateString } from './dateUtils';

export interface IngredientEditFormData {
  name: string;
  quantity: string;
  unitId: number;
  storageMethodId: number;
  purchasedOn: Date;
  expiresOn: Date;
}

/**
 * @param isCatalogItem 카탈로그 재료는 이름을 수정하지 않음 (목록에는 카탈로그 이름이 우선 표시됨)
 */
export const useIngredientEdit = (ingredientId: number, isCatalogItem: boolean) => {
  const [isSaving, setIsSaving] = useState(false);

  const save = async (form: IngredientEditFormData): Promise<boolean> => {
    const name = form.name.trim();
    const quantity = parseFloat(form.quantity);
    const purchasedOn = toDateString(form.purchasedOn);
    const expiresOn = toDateString(form.expiresOn);

    if (!isCatalogItem && !name) {
      Alert.alert('알림', '식재료 이름을 입력해주세요.');
      return false;
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      Alert.alert('알림', '양을 올바르게 입력해주세요.');
      return false;
    }
    if (!form.unitId) {
      Alert.alert('알림', '단위를 선택해주세요.');
      return false;
    }
    if (purchasedOn > toDateString(new Date())) {
      Alert.alert('알림', '등록일자는 오늘 이후로 설정할 수 없습니다.');
      return false;
    }
    if (expiresOn < purchasedOn) {
      Alert.alert('알림', '소비기한은 등록일자보다 빠를 수 없습니다.');
      return false;
    }

    try {
      setIsSaving(true);
      const response = await updateIngredient(ingredientId, {
        customName: isCatalogItem ? null : name,
        quantity,
        unitId: form.unitId,
        storageMethodId: form.storageMethodId,
        purchasedOn,
        expiresOn,
      });

      if (response.success) return true;

      Alert.alert('오류', response.error?.message || '재료 수정에 실패했습니다.');
      return false;
    } catch (err) {
      console.error('Failed to update ingredient:', err);
      // 서버의 업무 규칙 메시지(예: 소진·폐기 이력이 있으면 단위 변경 불가)는 그대로 보여주고,
      // "field: ..." 형태의 필드 검증 메시지만 사용자용 문구로 대체
      const serverMessage: string | undefined = isAxiosError(err) ? err.response?.data?.error?.message : undefined;
      const errorMessage = !isAxiosError(err) || !err.response
        ? '서버와 연결할 수 없습니다.'
        : serverMessage && !serverMessage.includes(':')
          ? serverMessage
          : '입력한 정보를 확인해주세요.';
      Alert.alert('오류', errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving };
};
