import { useState } from 'react';
import { Alert } from 'react-native';
import { isAxiosError } from 'axios';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { login as loginApi } from '../api/authApi';
import { AuthUser } from '../types';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<AuthUser | null> => {
    if (!email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return null;
    }

    if (!password) {
      Alert.alert('알림', '비밀번호를 입력해주세요.');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await loginApi({ email: email.trim(), password });

      if (response.success && response.data) {
        await tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data.user;
      }

      const errorMessage = response.error?.message || '로그인에 실패했습니다.';
      Alert.alert('오류', errorMessage);
      setError(errorMessage);
      return null;
    } catch (err) {
      console.error('Failed to login:', err);
      const errorMessage = isAxiosError(err) && err.response
        ? err.response.data?.error?.message || '이메일 또는 비밀번호를 확인해주세요.'
        : '서버와 연결할 수 없습니다.';
      Alert.alert('오류', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};
