const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN_LENGTH = 8;
// 백엔드(bcrypt) 제한: UTF-8 기준 72바이트
const PASSWORD_MAX_BYTES = 72;

export const isValidEmail = (email: string) => EMAIL_REGEX.test(email.trim());

export const isPasswordTooLong = (password: string) =>
  new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES;
