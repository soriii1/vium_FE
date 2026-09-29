import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  useIngredientUpload,
  useIngredientsList,
  useIngredientDispose,
  FridgeHeader,
  FridgeGrid,
} from '@/features/ingredient';
import { useFridgeCleanup, FridgeCleanupModal } from '@/features/fridge-cleanup';
import { useMyProfile } from '@/features/account';
import { AddButton, Card } from '@/shared/ui';
import BackIcon from '@/../assets/icons/back-icon.svg';
import TrashIcon from '@/../assets/icons/trash-icon.svg';

export const FridgePage = () => {
  const router = useRouter();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const { showIngredientUploadOptions } = useIngredientUpload();
  const { items: fridgeItems, isLoading, error, refresh } = useIngredientsList();
  const { disposeItems, isDisposing } = useIngredientDispose();
  const { isCleanupModalVisible, openCleanupModal, closeCleanupModal } = useFridgeCleanup();
  const { profile } = useMyProfile();
  const fridgeTitle = profile.nickname ? `${profile.nickname}의 식재료` : '나의 식재료';

  const handleReceiptPress = () => {
    showIngredientUploadOptions((uri) => {
      console.log('처리할 재료 이미지:', uri);
    });
  };

  const handleToggleSelect = (itemId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleDelete = () => {
    if (selectedItems.size === 0) {
      Alert.alert('알림', '삭제할 항목을 선택해주세요.');
      return;
    }

    Alert.alert(
      '삭제 확인',
      `선택한 ${selectedItems.size}개의 항목을 삭제하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            const targets = fridgeItems.filter((item) => selectedItems.has(item.id));
            const failedCount = await disposeItems(targets);

            setSelectedItems(new Set());
            setIsDeleteMode(false);
            refresh();

            if (failedCount > 0) {
              Alert.alert('오류', `${failedCount}개 항목을 삭제하지 못했습니다. 다시 시도해주세요.`);
            }
          },
        },
      ]
    );
  };

  const handleCancelDelete = () => {
    setSelectedItems(new Set());
    setIsDeleteMode(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <FridgeHeader
          title={fridgeTitle}
          onBackPress={() => router.back()}
          onManagePress={() => setIsDeleteMode(true)}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00D1A7" />
          <Text className="mt-4 text-text14 text-text-200 font-sans">재료를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white">
        <FridgeHeader
          title={fridgeTitle}
          onBackPress={() => router.back()}
          onManagePress={() => setIsDeleteMode(true)}
        />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-text16 text-text-100 font-semibold font-sans mb-2">오류 발생</Text>
          <Text className="text-text14 text-text-200 font-sans text-center">{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* 일반 모드 또는 삭제 모드 헤더 */}
      {!isDeleteMode ? (
        <FridgeHeader
          title={fridgeTitle}
          onBackPress={() => router.back()}
          onManagePress={() => setIsDeleteMode(true)}
        />
      ) : (
        <View className="px-4 md:px-8 lg:px-16 pt-16 pb-4 mt-[40px] max-w-[1200px] mx-auto w-full">
          <View className="flex-row items-center mb-[27px]">
            <Pressable onPress={handleCancelDelete} className="mr-4 md:mr-6">
              <BackIcon width={24} height={24} color="#333333" />
            </Pressable>
            <Text className="text-text-100 text-title md:text-[28px] lg:text-[32px] font-medium font-sans">
              식재료 관리하기
            </Text>
          </View>

          <View className="flex-row pl-[10px] gap-[190px]">
            <Text className="text-neutral-700 text-text14 font-sans">
              {selectedItems.size}개의 식재료가 선택됨
            </Text>
            <Pressable
              onPress={handleDelete}
              disabled={isDisposing}
              hitSlop={8}
              className={`ml-3 ${isDisposing ? 'opacity-50' : ''}`}
            >
              <TrashIcon width={24} height={24} />
            </Pressable>
          </View>
        </View>
      )}

      {/* 일반 모드 또는 삭제 모드 그리드 */}
      {!isDeleteMode ? (
        <FridgeGrid
          items={fridgeItems}
          onAddPress={() => router.push('/fridge/add' as any)}
          onItemPress={(item) => router.push(`/fridge/${item.id}` as any)}
        />
      ) : (
        <ScrollView
          className="flex-1 px-4 md:px-8 lg:px-16"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="flex-row flex-wrap -mx-2 max-w-[1200px] mx-auto w-full">
            {fridgeItems.map((item) => {
              const isSelected = selectedItems.has(item.id);

              return (
                <View key={item.id} className="mb-4 px-2 w-1/3 md:w-1/4 lg:w-1/5">
                  <Pressable onPress={() => handleToggleSelect(item.id)}>
                    <View className="relative">
                      <Card
                        title={item.title}
                        subtitle={item.subtitle}
                        status={item.status}
                        image={item.image}
                        visible={true}
                      />

                      {/* Selection Indicator - 카드 위에 절대 위치 */}
                      <View className="absolute top-2 right-2 z-20">
                        <View className={`w-[17px] h-[17px] rounded-full border-2 border-neutral-400 ${
                          isSelected ? 'bg-neutral-300' : 'bg-white'
                        }`} />
                      </View>
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* AddButton - 일반 모드: 사진/영수증 등록, 삭제 모드: 냉장고 대청소 */}
      {!isDeleteMode ? (
        <AddButton
          icon="photo"
          onReceiptPress={handleReceiptPress}
          onCartPress={() => console.log('온라인 장바구니 등록')}
          style={{ position: 'absolute', bottom: 120, right: 29 }}
        />
      ) : (
        <AddButton
          icon="plus"
          onPress={openCleanupModal}
          style={{ position: 'absolute', bottom: 120, right: 29 }}
        />
      )}


      <FridgeCleanupModal
        visible={isCleanupModalVisible}
        onClose={closeCleanupModal}
        onConfirm={() => {
          closeCleanupModal();
          router.push('/fridge/cleanup/select' as any);
        }}
      />
    </View>
  );
};
