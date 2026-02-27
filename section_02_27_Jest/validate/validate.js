// validate.js

// 공통으로 사용되는 유효성 검사 함수
function validatePassword(password) {
  // 길이 검사 (최소 8자, 최대 20자)
  if (password.length < 8 || password.length > 20) {
    return {
      isValid: false,
      reason: "비밀번호는 8자 이상, 20자 이하여야 합니다.",
    };
  }

  // 대문자 포함 여부 검사
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      reason: "비밀번호에 최소 하나의 대문자가 포함되어야 합니다.",
    };
  }

  // 소문자 포함 여부 검사
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      reason: "비밀번호에 최소 하나의 소문자가 포함되어야 합니다.",
    };
  }

  // 숫자 포함 여부 검사
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      reason: "비밀번호에 최소 하나의 숫자가 포함되어야 합니다.",
    };
  }

  // 특수문자 포함 여부 검사
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (!specialChars.test(password)) {
    return {
      isValid: false,
      reason: "비밀번호에 최소 하나의 특수문자가 포함되어야 합니다.",
    };
  }

  // 금지된 특수문자 검사 (예: <, >, ', ")
  const forbiddenChars = /[<>'"]|javascript:|alert\s*\(/i;
  if (forbiddenChars.test(password)) {
    return {
      isValid: false,
      reason: "비밀번호에 보안상 위험한 문자(<, >, ', \")가 포함되어 있습니다.",
    };
  }

  // 모든 검사를 통과했을 경우
  return {
    isValid: true,
    reason: "유효한 비밀번호입니다.",
  };
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = { validatePassword, validateEmail };
