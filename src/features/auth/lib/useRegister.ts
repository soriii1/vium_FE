import { useState } from 'react';
import { Alert } from 'react-native';
import { isAxiosError } from 'axios';
import { login as loginApi, register as registerApi } from '../api/authApi';
import { saveSession } from './saveSession';
import { signUpDraftStore } from './signUpDraftStore';

/**
 * - success: 가입 + 자동 로그인 완료
 * - needsCredentials: 1단계 입력값이 없거나 이메일 중복 → 이메일/비밀번호 화면으로
 * - needsLogin: 가입은 됐지만 자동 로그인 실패 → 로그인 화면으로
 * - error: 그 외 실패 (현재 화면 유지)
 */
export type RegisterResult = 'success' | 'needsCredentials' | 'needsLogin' | 'error';

/**
 * 회원가입 2단계: 닉네임과 1단계 입력값으로 가입 후 자동 로그인
 */
export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (displayName: string): Promise<RegisterResult> => {
    const draft = signUpDraftStore.get();
    if (!draft) {
      Alert.alert('알림', '이메일과 비밀번호를 다시 입력해주세요.');
      return 'needsCredentials';
    }

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return 'error';
    }

    try {
      setIsLoading(true);
      await registerApi({ email: draft.email, password: draft.password, displayName: trimmedName });
    } catch (err) {
      console.error('Failed to register:', err);
      setIsLoading(false);
      if (isAxiosError(err) && err.response?.data?.error?.code === 'CONFLICT') {
        Alert.alert('알림', '이미 사용 중인 이메일입니다.');
        return 'needsCredentials';
      }
      // 400(INVALID_REQUEST) 중 필드 검증 메시지는 "email: ..." 형태라 사용자용 문구로 대체
      const errorMessage = !isAxiosError(err) || !err.response
        ? '서버와 연결할 수 없습니다.'
        : err.response.data?.error?.message?.includes(':')
          ? '입력한 정보를 확인해주세요.'
          : err.response.data?.error?.message || '회원가입에 실패했습니다.';
      Alert.alert('오류', errorMessage);
      return 'error';
    }

    try {
      const response = await loginApi({ email: draft.email, password: draft.password });
      if (!response.success || !response.data) throw new Error(response.error?.message);
      await saveSession(response.data);
      signUpDraftStore.clear();
      return 'success';
    } catch (err) {
      console.error('Failed to login after register:', err);
      signUpDraftStore.clear();
      Alert.alert('알림', '회원가입이 완료되었습니다. 로그인해주세요.');
      return 'needsLogin';
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
  };
};
