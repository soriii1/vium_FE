import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { sessionUserStore } from '@/shared/lib/sessionUser';
import { tokenStorage } from '@/shared/lib/tokenStorage';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const REFRESH_PATH = '/api/auth/token/refresh';
// 토큰 없이 호출하는 인증 API — 401이어도 재발급하지 않고 그대로 에러 전달 (예: 비밀번호 오류)
const PUBLIC_AUTH_PATHS = ['/api/auth/login', '/api/auth/register', REFRESH_PATH];

interface RefreshApiResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  } | null;
}

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 동시에 여러 요청이 401을 받아도 재발급은 한 번만 수행 (백엔드가 refresh token을 1회용으로 회전시킴)
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    // 인터셉터 재귀를 피하기 위해 apiClient가 아닌 기본 axios 사용
    const response = await axios.post<RefreshApiResponse>(
      `${API_BASE_URL}${REFRESH_PATH}`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.data.success || !response.data.data) return null;

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    await tokenStorage.setTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch (err) {
    console.error('Failed to refresh token:', err);
    return null;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const isPublicAuthRequest = PUBLIC_AUTH_PATHS.includes(originalRequest?.url ?? '');

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isPublicAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
    const newAccessToken = await refreshPromise;

    if (!newAccessToken) {
      await tokenStorage.clearTokens();
      await sessionUserStore.clear();
      router.replace('/login');
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return apiClient(originalRequest);
  }
);
