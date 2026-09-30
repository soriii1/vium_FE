import { useState } from 'react';
import { Alert } from 'react-native';
import { registerIngredient } from '../api/ingredientsApi';
import { IngredientRegisterRequest } from '../types';

export interface IngredientFormData {
  name: string;
  // 카탈로그에서 고른 재료 (직접 입력한 재료는 undefined — 레시피 추천에서 제외됨)
  ingredientCatalogId?: number;
  amount: string;
  unitId: number;
  storageMethodId: number;
  price: string;
  registeredDate: string;
  expiryDate: string;
  imageUri?: string;
}

export const useIngredientRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (formData: IngredientFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!formData.name.trim()) {
        Alert.alert('알림', '식재료 이름을 입력해주세요.');
        return false;
      }

      if (!formData.amount.trim()) {
        Alert.alert('알림', '양을 입력해주세요.');
        return false;
      }

      if (!formData.unitId) {
        Alert.alert('알림', '단위를 선택해주세요.');
        return false;
      }

      if (!formData.expiryDate.trim()) {
        Alert.alert('알림', '소비기한을 입력해주세요.');
        return false;
      }

      const request: IngredientRegisterRequest = {
        ingredientCatalogId: formData.ingredientCatalogId,
        customName: formData.name,
        quantity: parseFloat(formData.amount) || 1,
        unitId: formData.unitId,
        storageMethodId: formData.storageMethodId,
        purchasedOn: formData.registeredDate ? formatDateToISO(formData.registeredDate) : undefined,
        expiresOn: formatDateToISO(formData.expiryDate),
        amount: formData.price ? parseInt(formData.price.replace(/,/g, ''), 10) : undefined,
      };

      const response = await registerIngredient(request);

      if (response.success) {
        Alert.alert('성공', '재료가 등록되었습니다.');
        return true;
      } else {
        const errorMessage = response.error?.message || '재료 등록에 실패했습니다.';
        Alert.alert('오류', errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (err: any) {
      console.error('Failed to register ingredient:', err);
      const errorMessage = err.message || '서버와 연결할 수 없습니다.';
      Alert.alert('오류', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
};

const formatDateToISO = (dateString: string): string => {
  return dateString.replace(/\//g, '-');
};
