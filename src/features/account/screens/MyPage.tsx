import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import ChevronIcon from '@/../assets/icons/chevron-left-icon.svg';
import { useLogout } from '@/features/auth';
import { profileStore } from '../lib/profileStore';
import { useMyProfile } from '../lib/useMyProfile';
import { MyPageMenuKey } from '../types';
import { Logo } from '@/shared/ui';

const MENU_ITEMS: { key: MyPageMenuKey; label: string }[] = [
  { key: 'logout', label: '로그아웃' },
  { key: 'settings', label: '설정' },
  { key: 'inquiry', label: '문의' },
  { key: 'withdraw', label: '회원 탈퇴' },
];

export const MyPage: React.FC = () => {
  const router = useRouter();
  const { profile } = useMyProfile();
  const { logout } = useLogout();

  const handleEditProfile = () => {
    router.push('/mypage/edit' as any);
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await logout();
          // 로그아웃되면 (tabs)가 보호 라우트라 스택에서 제거됨 → 로그인 화면으로 이동
          router.replace('/login');
          // 다음 로그인 사용자에게 이전 프로필 수정 내용이 남지 않도록 초기화
          profileStore.reset();
        },
      },
    ]);
  };

  const handleMenuPress = (key: MyPageMenuKey) => {
    if (key === 'settings') {
      router.push('/debug');
      return;
    }
    if (key === 'logout') {
      handleLogout();
      return;
    }
    // TODO: 나머지 메뉴 동작 연결 (문의/회원 탈퇴)
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 140 }}>
      <View className="px-5 md:px-10 lg:px-20 pt-[74px]">
        <Logo />
      </View>

      <View className="items-center px-5 pt-[55px]">
        <View className="w-full max-w-[271px] items-center gap-[78px]">
          {/* 프로필 */}
          <View className="w-full max-w-[256px] items-center gap-[26px]">
            <View className="items-center gap-6">
              <View className="w-[117px] h-[117px] rounded-full border-[3px] border-secondary-400 overflow-hidden bg-neutral-50">
                {profile.profileImageUrl && (
                  <Image
                    source={{ uri: profile.profileImageUrl }}
                    contentFit="cover"
                    className="w-full h-full"
                  />
                )}
              </View>
              <View className="items-center gap-2">
                <Text className="text-[17px] font-medium font-sans text-black text-center">
                  {profile.nickname}
                </Text>
                <Text className="text-text15 font-light font-sans text-neutral-300 text-center">
                  @{profile.handle}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleEditProfile}
              className="w-full bg-neutral-50 rounded-2xl p-[10px] items-center justify-center"
            >
              <Text className="text-text15 font-normal font-sans text-black">프로필 수정</Text>
            </Pressable>
          </View>

          {/* 메뉴 */}
          <View className="w-full gap-[33px]">
            {MENU_ITEMS.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => handleMenuPress(item.key)}
                className="flex-row items-center justify-between"
              >
                <Text className="text-text15 font-normal font-sans text-black">{item.label}</Text>
                <View className="rotate-180">
                  <ChevronIcon width={16} height={16} color="#000000" />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
