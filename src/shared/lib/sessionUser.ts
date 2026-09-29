import { useSyncExternalStore } from 'react';
import { getItem, removeItem, setItem } from './secureStorage';

/**
 * 로그인한 사용자 정보.
 * 로그인 응답으로 저장하고, 화면 진입 시 GET /api/me 응답으로 갱신합니다.
 */
export interface SessionUser {
  id: number;
  email: string;
  displayName: string;
}

const SESSION_USER_KEY = 'sessionUser';

let state: SessionUser | null = null;
let hasLoaded = false;
// 저장소 로딩 중에 set/clear가 먼저 일어나면 로딩 결과로 덮어쓰지 않도록 구분
let version = 0;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

const load = async () => {
  const loadVersion = version;
  try {
    const raw = await getItem(SESSION_USER_KEY);
    if (loadVersion !== version) return;
    state = raw ? (JSON.parse(raw) as SessionUser) : null;
    emit();
  } catch (err) {
    console.error('Failed to load session user:', err);
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  if (!hasLoaded) {
    hasLoaded = true;
    load();
  }
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

export const sessionUserStore = {
  getState: () => state,
  set: async (user: SessionUser) => {
    version += 1;
    hasLoaded = true;
    state = user;
    emit();
    await setItem(SESSION_USER_KEY, JSON.stringify(user));
  },
  clear: async () => {
    version += 1;
    hasLoaded = true;
    state = null;
    emit();
    await removeItem(SESSION_USER_KEY);
  },
};

export const useSessionUser = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
