import { useSyncExternalStore } from 'react';

interface ProfileOverrides {
  nickname: string | null;
  profileImageUrl: string | null;
}

/**
 * 프로필 수정 API 연동 전까지 수정 내용을 앱 메모리에 보관합니다.
 * 앱을 다시 시작하면 로그인 정보(sessionUser) 기준으로 초기화됩니다.
 */
let state: ProfileOverrides = { nickname: null, profileImageUrl: null };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

const updateProfile = (changes: Partial<ProfileOverrides>) => {
  state = { ...state, ...changes };
  emit();
};

const reset = () => {
  state = { nickname: null, profileImageUrl: null };
  emit();
};

export const profileStore = {
  updateProfile,
  reset,
  getState: () => state,
};

export const useProfileStore = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
