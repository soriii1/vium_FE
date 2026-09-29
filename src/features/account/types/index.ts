export interface MyProfile {
  nickname: string;
  handle: string;
  profileImageUrl: string | null;
}

export type MyPageMenuKey = 'logout' | 'settings' | 'inquiry' | 'withdraw';

export interface MeApiResponse {
  success: boolean;
  data: {
    id: number;
    email: string;
    displayName: string;
  } | null;
  error: null | {
    code: string;
    message: string;
  };
}
