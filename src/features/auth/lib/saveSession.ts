import { sessionUserStore } from '@/shared/lib/sessionUser';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { LoginApiResponse } from '../types';

export const saveSession = async (data: NonNullable<LoginApiResponse['data']>) => {
  await tokenStorage.setTokens(data.accessToken, data.refreshToken);
  await sessionUserStore.set(data.user);
};
