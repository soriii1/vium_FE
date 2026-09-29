import { Alert } from 'react-native';
import { signUpDraftStore } from './signUpDraftStore';
import { PASSWORD_MIN_LENGTH, isPasswordTooLong, isValidEmail } from './validators';

/**
 * 회원가입 1단계: 이메일/비밀번호 검증 후 2단계(닉네임)로 넘길 값을 보관
 */
export const useSignUpCredentials = () => {
  const checkEmail = (email: string) => {
    if (!email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return false;
    }
    if (!isValidEmail(email)) {
      Alert.alert('알림', '올바른 이메일 형식이 아닙니다.');
      return false;
    }
    return true;
  };

  const submit = (email: string, password: string, passwordConfirm: string) => {
    if (!checkEmail(email)) return false;

    if (password.length < PASSWORD_MIN_LENGTH) {
      Alert.alert('알림', `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`);
      return false;
    }
    if (isPasswordTooLong(password)) {
      Alert.alert('알림', '비밀번호가 너무 깁니다.');
      return false;
    }
    if (password !== passwordConfirm) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return false;
    }

    signUpDraftStore.set({ email: email.trim(), password });
    return true;
  };

  return {
    checkEmail,
    submit,
  };
};
