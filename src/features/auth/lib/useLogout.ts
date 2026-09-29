import { useRef } from 'react';
import { sessionUserStore } from '@/shared/lib/sessionUser';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { logout as logoutApi } from '../api/authApi';

export const useLogout = () => {
  // 로그아웃 후 바로 화면을 이동하므로 state 대신 ref로 중복 실행만 막음
  const isLoggingOut = useRef(false);

  const logout = async () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;

    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) {
        await logoutApi({ refreshToken });
      }
    } catch (err) {
      // 서버 세션 폐기에 실패해도 기기에서는 로그아웃 처리
      console.error('Failed to logout:', err);
    } finally {
      await tokenStorage.clearTokens();
      await sessionUserStore.clear();
      isLoggingOut.current = false;
    }
  };

  return { logout };
};
