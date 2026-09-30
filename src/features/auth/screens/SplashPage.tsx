import { Button } from '@/shared/ui/Button';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { Logo } from '@/shared/ui';

export const SplashPage = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-screen md:px-10 lg:px-20">
        <View className="items-center">
          <Logo width={200} />
          <Text className="mt-[24px] text-subtitle md:text-[24px] lg:text-[28px] font-medium text-text-100 text-center mt-4 font-sans">
            나만의 폐기관리 도우미
          </Text>
        </View>
      </View>

      <View className="w-full items-center pb-[100px]">
        <Button onPress={() => router.push('/login')}>
          시작하기
        </Button>
      </View>
    </View>
  );
};
