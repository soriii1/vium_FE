import React, { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import BackIcon from '@/../assets/icons/back-icon.svg';
import { AppHeader } from './AppHeader';

interface ComingSoonProps {
  title: string;
  icon?: ReactNode;
}

/** 아직 개발 전인 기능에 들어왔을 때 보여주는 안내 화면 */
export const ComingSoon: React.FC<ComingSoonProps> = ({ title, icon }) => {
  const router = useRouter();

  const handleBack = () => (router.canGoBack() ? router.back() : router.replace('/main'));

  return (
    <View className="flex-1 bg-white">
      <AppHeader />

      <View className="px-screen md:px-10 lg:px-20 pt-10">
        <Pressable onPress={handleBack} className="flex-row items-center gap-4 self-start" hitSlop={8}>
          <BackIcon width={30} height={30} color="#242529" />
          <Text className="text-title font-medium font-sans text-text-100">{title}</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-screen pb-[140px] gap-5">
        {icon && <View className="w-20 h-20 rounded-full bg-primary-200 items-center justify-center">{icon}</View>}
        <View className="items-center gap-2">
          <Text className="text-subtitle font-medium font-sans text-text-100">아직 준비 중이에요</Text>
          <Text className="text-text14 font-sans text-text-200 text-center">
            {title} 기능을 열심히 만들고 있어요.{'\n'}조금만 기다려 주세요!
          </Text>
        </View>
      </View>
    </View>
  );
};
