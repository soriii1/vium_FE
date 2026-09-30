import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBadge, DetailInfoRow, AppHeader } from '@/shared/ui';
import { useIngredientDetail } from '../lib/useIngredientDetail';
import { getIngredientImage } from '../lib/ingredientImageFixtures';
import BackIcon from '@/../assets/icons/back-icon.svg';
import EditIcon from '@/../assets/icons/edit-icon.svg';

export const FridgeDetailPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const itemId = parseInt(id || '1', 10);
  const { item, isLoading, error } = useIngredientDetail(itemId);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#00D1A7" />
        <Text className="mt-4 text-text14 text-text-200 font-sans">재료 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-text16 font-sans text-text-100 font-semibold mb-2">오류 발생</Text>
        <Text className="text-text14 font-sans text-text-200">
          {error || '아이템을 찾을 수 없습니다.'}
        </Text>
      </View>
    );
  }

  const detailImage = getIngredientImage(item.title, 'large');

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <AppHeader />

        <View className="px-screen pt-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-[30px] h-[30px] items-center justify-center"
          >
            <BackIcon width={30} height={30} />
          </TouchableOpacity>

          <View className="pt-[41px]">
            <View className="w-full h-[241px] rounded-2xl overflow-hidden bg-neutral-10 items-center justify-center">
              {detailImage && (
                <Image source={{ uri: detailImage }} contentFit="contain" className="w-[70%] h-[80%]" />
              )}
            </View>

            <View className="pt-6 px-2.5">
              <View className="flex-row justify-between items-center h-8 mb-[32px]">
                <View className="flex-row items-center gap-2 flex-1 mr-3">
                  <Text numberOfLines={1} className="text-title font-bold font-sans text-text-100 shrink">
                    {item.title}
                  </Text>
                  <Pressable
                    onPress={() => router.push(`/fridge/${itemId}/edit` as any)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="식재료 수정"
                  >
                    <EditIcon width={22} height={22} color="#767676" />
                  </Pressable>
                </View>
                <StatusBadge status={item.status} />
              </View>

              <View className="gap-y-4">
                <DetailInfoRow label="양" value={item.quantity} />
                <DetailInfoRow label="가격" value={item.price} />
                <DetailInfoRow label="등록일자" value={item.registeredDate} />
                <DetailInfoRow label="소비기한" value={item.expirationDate} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

    </View>
  );
};
