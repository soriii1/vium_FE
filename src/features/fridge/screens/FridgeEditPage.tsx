import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LabelInputWithUnit, DatePicker, AppHeader } from '@/shared/ui';
import BackIcon from '@/../assets/icons/back-icon.svg';
import { useIngredientDetail } from '../lib/useIngredientDetail';
import { useIngredientEdit } from '../lib/useIngredientEdit';
import { parseDateString } from '../lib/dateUtils';
import { StorageMethodSelect, STORAGE_METHOD_OPTIONS } from '../ui/StorageMethodSelect';
import { IngredientApiResponse } from '../types';

export const FridgeEditPage: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const itemId = parseInt(id || '0', 10);
  const { ingredient, isLoading, error } = useIngredientDetail(itemId);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#00D1A7" />
      </View>
    );
  }

  if (error || !ingredient) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-text14 font-sans text-text-200">{error || '재료를 찾을 수 없습니다.'}</Text>
      </View>
    );
  }

  // 데이터가 준비된 뒤에 폼을 그려야 초기값이 채워짐
  return <FridgeEditForm ingredient={ingredient} />;
};

const FridgeEditForm: React.FC<{ ingredient: IngredientApiResponse }> = ({ ingredient }) => {
  const router = useRouter();
  const isCatalogItem = ingredient.ingredientCatalogId !== null;
  const { save, isSaving } = useIngredientEdit(ingredient.inventoryItemId, isCatalogItem);

  const [name, setName] = useState(ingredient.name);
  const [quantity, setQuantity] = useState(String(ingredient.initialQuantity));
  const [unitId, setUnitId] = useState(ingredient.unitId);
  // TODO: 목록 API가 보관방법을 내려주지 않아 기본값(냉장)으로 시작 — 백엔드에 storageMethodId 추가 요청
  const [storageMethodId, setStorageMethodId] = useState<number>(STORAGE_METHOD_OPTIONS[0].id);
  const [purchasedOn, setPurchasedOn] = useState(parseDateString(ingredient.purchasedOn));
  const [expiresOn, setExpiresOn] = useState(parseDateString(ingredient.expiresOn));

  // 백엔드 수량 정밀도(소수 3자리)에 맞춰 부동소수점 오차 제거
  const processedQuantity = Math.round((ingredient.initialQuantity - ingredient.remainingQuantity) * 1000) / 1000;

  const handleSave = async () => {
    const success = await save({ name, quantity, unitId, storageMethodId, purchasedOn, expiresOn });
    if (success) router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <AppHeader />

        <View className="px-screen gap-10 pt-10">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <BackIcon width={30} height={30} />
          </Pressable>

          <View className="gap-6 w-full max-w-[346px]">
            <View className="gap-1">
              <TextInput
                className={`text-title font-medium font-sans ${isCatalogItem ? 'text-neutral-300' : 'text-text-100'}`}
                style={{ fontFamily: 'Paperlogy' }}
                value={name}
                onChangeText={setName}
                editable={!isCatalogItem}
                maxLength={120}
                placeholder="입력해주세요"
                placeholderTextColor="#878787"
              />
              {isCatalogItem && (
                <Text className="text-text14 font-sans text-text-300">기본 식재료는 이름을 수정할 수 없어요</Text>
              )}
            </View>

            <View className="gap-4">
              <LabelInputWithUnit
                label="양"
                value={quantity}
                onChangeText={setQuantity}
                unitId={unitId}
                onUnitChange={(nextUnitId) => setUnitId(nextUnitId)}
                placeholder="입력하세요"
                keyboardType="decimal-pad"
              />
              {processedQuantity > 0 && (
                <Text className="text-text14 font-sans text-text-300 text-right">
                  이미 사용·폐기한 {processedQuantity}
                  {ingredient.unit} 이상이어야 하고, 단위는 바꿀 수 없어요
                </Text>
              )}
              <StorageMethodSelect label="보관방법" value={storageMethodId} onChange={setStorageMethodId} />
              <DatePicker label="등록일자" value={purchasedOn} onChange={setPurchasedOn} />
              <DatePicker label="소비기한" value={expiresOn} onChange={setExpiresOn} />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-12 pb-[100px] items-center">
        <Pressable
          className={`bg-neutral-500 rounded-3xl items-center justify-center px-2.5 py-[15px] w-[299px] ${isSaving ? 'opacity-50' : ''}`}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-text-400 text-subtitle text-center font-sans">수정하기</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};
