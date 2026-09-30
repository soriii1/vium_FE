import React, { ReactNode } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { sessionUserStore } from '@/shared/lib/sessionUser';
import { tokenStorage } from '@/shared/lib/tokenStorage';
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
  const router = useRouter();

  // [개발 모드 전용] 로고를 누르면 기기 로그인 정보를 지우고 스플래시부터 다시 시작
  // 서버 세션은 폐기하지 않음 (refresh token은 만료 시까지 서버에 남음)
  const handleDebugRestart = () => {
    Alert.alert('디버그', '로그아웃하고 스플래시부터 다시 시작할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '다시 시작',
        style: 'destructive',
        onPress: async () => {
          await tokenStorage.clearTokens();
          await sessionUserStore.clear();
          router.replace('/splash');
        },
      },
    ]);
  };

  return (
    <View
      className="px-screen md:px-10 lg:px-20 h-[35px] flex-row items-center justify-between"
      style={[{ marginTop: insets.top + GAP_BELOW_STATUS_BAR }, style]}
    >
      {__DEV__ ? (
        <Pressable onPress={handleDebugRestart} hitSlop={8}>
          <Logo />
        </Pressable>
      ) : (
        <Logo />
      )}
      {right}
    </View>
  );
};
