import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from './Logo';

// Figma: 상태바 아래 12px
const GAP_BELOW_STATUS_BAR = 12;

interface AppHeaderProps {
  // 오른쪽 영역 (예: 홈의 알림 아이콘)
  right?: ReactNode;
  style?: any;
}

/**
 * 전 화면 공통 상단 헤더 — 로고 위치를 한 곳에서 관리
 * 상단 여백은 기기 안전 영역(노치/다이내믹 아일랜드) 기준이라 기기마다 같은 자리에 표시됨
 */
export const AppHeader: React.FC<AppHeaderProps> = ({ right, style }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="px-screen md:px-10 lg:px-20 h-[35px] flex-row items-center justify-between"
      style={[{ marginTop: insets.top + GAP_BELOW_STATUS_BAR }, style]}
    >
      <Logo />
      {right}
    </View>
  );
};
