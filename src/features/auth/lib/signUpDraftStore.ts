interface SignUpDraft {
  email: string;
  password: string;
}

/**
 * 회원가입 1단계(이메일/비밀번호) 입력값을 2단계(닉네임)까지 메모리에 보관합니다.
 * 비밀번호가 URL에 노출되지 않도록 라우트 파라미터 대신 사용합니다.
 */
let draft: SignUpDraft | null = null;

export const signUpDraftStore = {
  get: () => draft,
  set: (value: SignUpDraft) => {
    draft = value;
  },
  clear: () => {
    draft = null;
  },
};
