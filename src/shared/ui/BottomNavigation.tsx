import React from 'react';
import { View } from 'react-native';
import { usePathname } from 'expo-router';
import { NavBar } from './NavBar';

// 하단 탭을 보여줄 화면 (추가/정리/수정 같은 작업 화면에서는 숨김)
const VISIBLE_PATTERNS = [
  /^\/main$/,
  /^\/report$/,
  /^\/fridge$/,
  /^\/fridge\/\d+$/,
  /^\/recipe$/,
  /^\/recipe\/[^/]+\/waste$/,
  /^\/mypage$/,
];

/**
 * (tabs) 레이아웃의 커스텀 tabBar
 * 화면 위에 떠 있는 디자인이라 absolute로 배치 (각 화면은 하단 여백으로 공간 확보)
 */
export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  if (!VISIBLE_PATTERNS.some((pattern) => pattern.test(pathname))) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 px-4 pb-6">
      <NavBar />
    </View>
  );
};
