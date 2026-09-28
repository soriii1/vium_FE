import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { MyPage as MyPageFeature } from '@/features/account';
import { useLogout } from '@/features/auth';
import { BottomNavigation } from '@/widgets';

export const MyPage: React.FC = () => {
  const { logout } = useLogout();

  const handleLogout = async () => {
    await logout();
    // 뒤로 가기로 로그인 이후 화면에 돌아가지 않도록 스택을 비우고 이동
    if (router.canDismiss()) router.dismissAll();
    router.replace('/login');
  };

  return (
    <View className="flex-1 bg-white">
      <MyPageFeature onLogout={handleLogout} />
      <BottomNavigation />
    </View>
  );
};
