import { useSessionUser } from '@/shared/lib/sessionUser';
import { MyProfile } from '../types';
import { useProfileStore } from './profileStore';

// 내 정보 API 연동 전까지는 로그인 응답으로 저장한 사용자 정보로 화면을 보여줍니다.
export const useMyProfile = () => {
  const user = useSessionUser();
  const overrides = useProfileStore();

  const profile: MyProfile = {
    nickname: overrides.nickname ?? user?.displayName ?? '',
    // 백엔드에 핸들 필드가 없어 이메일 앞부분을 사용
    handle: user?.email.split('@')[0] ?? '',
    profileImageUrl: overrides.profileImageUrl,
  };

  return {
    profile,
    isLoading: false,
    error: null as string | null,
  };
};
