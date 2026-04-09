export const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=\S+$).{8,}$/;
export const PASSWORD_ERROR = "비밀번호는 영문+숫자 조합 8자 이상이며 공백을 포함할 수 없습니다.";

export function validatePassword(password: string): string | null {
  if (!PASSWORD_REGEX.test(password)) return PASSWORD_ERROR;
  return null;
}
