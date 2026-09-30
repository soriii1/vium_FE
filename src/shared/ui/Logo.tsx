import React from 'react';
import { View } from 'react-native';
import ViumLogo from '@/../assets/icons/ViUM.svg';

// 원본 비율 184:51
const LOGO_RATIO = 51 / 184;

interface LogoProps {
  width?: number;
  style?: any;
}

/**
 * 화면 상단 로고 (Figma: 67 x 18.6)
 * 높이 28px 영역 안에 세로 가운데 정렬해 기존 헤더 레이아웃을 유지
 */
export const Logo: React.FC<LogoProps> = ({ width = 67, style }) => {
  return (
    <View className="h-7 justify-center" style={style} accessibilityRole="image" accessibilityLabel="ViUM">
      <ViumLogo width={width} height={width * LOGO_RATIO} />
    </View>
  );
};
