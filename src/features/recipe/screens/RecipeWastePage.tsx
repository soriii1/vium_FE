import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRecipeCookStore } from '../lib/recipeCookStore';

export const RecipeWastePage: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = parseInt(id || '1', 10);
  const { items, setRemainingPercent, reset } = useRecipeCookStore();
  const isFinishingRef = useRef(false);

  // 선택된 재료 없이 이 화면으로 바로 들어온 경우 상세 화면으로 돌려보냄
  useEffect(() => {
    if (items.length === 0 && !isFinishingRef.current) {
      router.replace(`/recipe/${recipeId}` as any);
    }
  }, [items.length]);

  // 레시피 API 연동 전까지는 서버에 저장하지 않습니다.
  const handleComplete = () => {
    isFinishingRef.current = true;
    reset();
    router.replace('/recipe' as any);
  };

  if (items.length === 0 && !isFinishingRef.current) {
    return <View className="flex-1" />;
  }

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-5 md:px-10 lg:px-20 pt-[74px]">
          <View className="bg-neutral-50 h-7 w-[79px] items-center justify-center">
            <Text className="text-text14 text-neutral-300 font-medium font-sans">Logo</Text>
          </View>
        </View>

        <View className="px-5 md:px-10 lg:px-20 pt-[49px] items-center">
          <View className="w-full max-w-[480px] gap-[72px]">
            <View className="gap-12">
              <Text className="text-title font-medium font-sans text-neutral-600">
                맛있게 드셨나요?{'\n'}재료 사용량 조사를 시작할게요!
              </Text>

              <View className="gap-7">
                {items.map((item) => (
                  <View key={item.id} className="gap-[19px] p-2.5">
                    <Text className="text-[20px] font-medium font-sans text-black">{item.name}</Text>
                    <View className="gap-2">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-[12px] font-sans text-neutral-400">0%</Text>
                        <Text className="text-[12px] font-sans text-neutral-400">100%</Text>
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
        </View>
      </ScrollView>

      <View className="px-12 pb-[100px] items-center">
        <Pressable
          className="bg-neutral-500 rounded-3xl items-center justify-center px-2.5 py-[15px] w-[299px]"
          onPress={handleComplete}
        >
          <Text className="text-text-400 text-subtitle text-center font-sans">완료</Text>
        </Pressable>
      </View>
    </View>
  );
};
