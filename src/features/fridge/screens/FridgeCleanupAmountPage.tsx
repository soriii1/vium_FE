import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useFridgeCleanupStore } from '../lib/fridgeCleanupStore';
import { useFridgeCleanupFinish } from '../lib/useFridgeCleanupFinish';
import { Logo } from '@/shared/ui';

export const FridgeCleanupAmountPage: React.FC = () => {
  const router = useRouter();
  const { items, setRemainingPercent, reset } = useFridgeCleanupStore();
  const { finish, isSubmitting } = useFridgeCleanupFinish();
  const isFinishingRef = useRef(false);

  // 선택된 재료 없이 이 화면으로 바로 들어온 경우 선택 화면으로 돌려보냄
  // (단, 정리 종료로 인해 store가 비워진 경우는 제외)
  useEffect(() => {
    if (items.length === 0 && !isFinishingRef.current) {
      router.replace('/fridge/cleanup/select' as any);
    }
  }, [items.length]);

  const handleFinish = async () => {
    const isSuccess = await finish();
    if (!isSuccess) return;

    isFinishingRef.current = true;
    reset();
    router.replace('/fridge' as any);
  };

  if (items.length === 0 && !isFinishingRef.current) {
    return <View className="flex-1 bg-white" />;
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 md:px-10 lg:px-20 pt-[74px]">
          <Logo />
        </View>

        <View className="flex-1 px-5 md:px-10 lg:px-20 pt-[64px] items-center">
          <View className="w-full max-w-[480px] gap-12">
            <Text className="text-title md:text-[28px] lg:text-[32px] font-medium text-text-100 font-sans">
              마지막 단계예요!{'\n'}얼마나 남겼는지 말해주세요
            </Text>

            <View className="gap-7">
              {items.map((item) => (
                <View key={item.id} className="gap-[19px] p-2.5">
                  <Text className="text-[20px] font-medium font-sans text-black">
                    {item.title}
                  </Text>
                  <View className="gap-2">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-text14 font-sans text-neutral-400">0%</Text>
                      <Text className="text-text14 font-sans text-neutral-400">100%</Text>
                    </View>
                    <Slider
                      minimumValue={0}
                      maximumValue={100}
                      step={1}
                      value={item.remainingPercent}
                      minimumTrackTintColor="#A2CD87"
                      maximumTrackTintColor="#EBEBEB"
                      thumbTintColor="#EBEBEB"
                      onValueChange={(value) => setRemainingPercent(item.id, value)}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-12 pb-[100px] items-center">
        <Pressable
          className={`bg-neutral-500 rounded-3xl items-center justify-center px-2.5 py-[15px] w-[299px] ${
            isSubmitting ? 'opacity-50' : ''
          }`}
          onPress={handleFinish}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-text-400 text-subtitle text-center font-sans">
              냉장고 정리 종료
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};
