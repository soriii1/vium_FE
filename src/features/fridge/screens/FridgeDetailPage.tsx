import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBadge, DetailInfoRow } from '@/shared/ui';
import { useIngredientDetail } from '../lib/useIngredientDetail';
import BackIcon from '@/../assets/icons/back-icon.svg';

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

  // 목데이터용 이미지 (당근 이미지)
  const carrotImage = 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80';

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="h-[102px] bg-white">
          {/* Status Bar Spacer */}
          <View className="h-[62px]" />

          {/* Logo */}
          <View className="px-7 h-7 justify-center">
            <View className="w-[79px] h-7 items-center justify-center">
              <Text className="text-text14 font-sans text-text-100">
                Logo
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-7 pt-8">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-[30px] h-[30px] items-center justify-center"
          >
            <BackIcon width={30} height={30} />
          </TouchableOpacity>

          {/* Image and Details Container */}
          <View className="pt-[41px]">
            {/* Food Image */}
            <View className="w-full h-[241px] rounded-2xl overflow-hidden bg-neutral-100">
              <Image
                source={{ uri: carrotImage }}
                contentFit="cover"
                className="w-full h-full"
              />
            </View>

            {/* Details Section */}
            <View className="pt-6 px-2.5">
              {/* Title and Status Badge */}
              <View className="flex-row justify-between items-center h-8 mb-[67px]">
                <Text className="text-title font-bold font-sans text-text-100">
                  {item.title}
                </Text>
                <StatusBadge status={item.status} />
              </View>

              {/* Info List */}
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

      {/* Bottom Navigation */}
    </View>
  );
};
