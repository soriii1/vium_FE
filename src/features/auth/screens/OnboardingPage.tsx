import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Button } from '@/shared/ui/Button';
import { router } from 'expo-router';
import { AppHeader } from '@/shared/ui';

const SHOPPING_FREQUENCY_OPTIONS = [
  '3일에 한 번',
  '1주일에 한 번',
  '1달에 한 번',
  '1년에 한 번',
] as const;

export const OnboardingPage = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleStart = () => {
    // TODO: Save onboarding data
    router.replace('/main');
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-screen md:px-10 lg:px-20 pt-[166px] items-center">
        <View className="absolute top-0 left-0 right-0">
          <AppHeader />
        </View>
        <View className="w-full max-w-[480px]">
          <View>
            <Text className="text-title md:text-[28px] lg:text-[32px] font-medium text-text-100 mb-[9px] font-sans">
              마지막으로{'\n'}얼마나 자주 장을 보시나요?
            </Text>
            <Text className="text-text14 md:text-text15 text-text-200 mb-[49px] font-sans">
              냉장고 정리 알림에 참고해요!
            </Text>

            <View className="gap-[14px]">
              {SHOPPING_FREQUENCY_OPTIONS.map((option, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedOption(index)}
                  className={`h-[42px] md:h-[48px] rounded-lg border-2 px-2.5 md:px-4 justify-center ${
                    selectedOption === index
                      ? 'bg-primary-200 border-primary-600'
                      : 'bg-white border-neutral-100'
                  }`}
                >
                  <Text className="text-text15 md:text-text16 font-sans text-text-100">
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className="w-full items-center pb-[100px]">
        <Button onPress={handleStart} disabled={selectedOption === null}>
          비움 시작하기
        </Button>
      </View>
    </View>
  );
};
