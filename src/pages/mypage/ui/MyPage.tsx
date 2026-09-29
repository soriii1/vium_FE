import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { MyPage as MyPageFeature } from '@/features/account';
import { useLogout } from '@/features/auth';

export const MyPage: React.FC = () => {
  const { logout } = useLogout();

  const handleLogout = async () => {
    await logout();
    // 로그아웃되면 (tabs)가 보호 라우트라 스택에서 제거됨 → 로그인 화면으로 이동
    router.replace('/login');
  };

  return (
    <View className="flex-1 bg-white">
      <MyPageFeature onLogout={handleLogout} />
    </View>
  );
};
