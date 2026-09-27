export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  displayName: string;
}

export interface LoginApiResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
  error: null | {
    code: string;
    message: string;
  };
}
