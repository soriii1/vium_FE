import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import NaverLogoIcon from '@/../assets/icons/naver-logo-icon.svg';
import AppleLogoIcon from '@/../assets/icons/apple-logo-icon.svg';

type SocialProvider = 'google' | 'naver' | 'apple';

interface SocialLoginButtonsProps {
  label: string;
  onPress?: (provider: SocialProvider) => void;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ label, onPress }) => {
  return (
    <View className="w-full max-w-[276px] items-center gap-[23px]">
      <View className="w-full flex-row items-center gap-[9px]">
        <View className="flex-1 h-px bg-text-300" />
        <Text className="text-text14 font-sans text-text-300 text-center">{label}</Text>
        <View className="flex-1 h-px bg-text-300" />
      </View>

      <View className="flex-row gap-[23px]">
        <Pressable onPress={() => onPress?.('google')} className="w-[50px] h-[50px]">
          <Image
            source={require('@/../assets/images/google-logo.png')}
            contentFit="contain"
            style={{ width: 50, height: 50 }}
          />
        </Pressable>
        {/* 네이버 브랜드 컬러 */}
        <Pressable
          onPress={() => onPress?.('naver')}
          className="w-[50px] h-[50px] rounded-full bg-[#03C75A] items-center justify-center"
        >
          <NaverLogoIcon width={20} height={20} />
        </Pressable>
        <Pressable
          onPress={() => onPress?.('apple')}
          className="w-[50px] h-[50px] rounded-full bg-white border border-black items-center justify-center"
        >
          <AppleLogoIcon width={16} height={20} />
        </Pressable>
      </View>
    </View>
  );
};
