// src/components/SignupForm.test.tsx

import { render, screen } from "@testing-library/react";
import { SignupForm } from ".";
import userEvent from "@testing-library/user-event";

test("이메일, 비밀번호, 확인 비밀번호 입력 후 제출 이벤트 테스트", async () => {
  // userEvent 설정
  const user = userEvent.setup();
  render(<SignupForm />);

  const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

  // 이메일 입력 필드 확인
  const emailInput = screen.getByLabelText("이메일");
  // 이메일 입력
  await user.type(emailInput, "test@example.com");
  // 이메일 필드에서 탭 키를 눌러 포커스 이동
  await user.tab();
  // X 버튼 부분에 focus 되어 한 번 더 탭 키를 눌러 포커스 이동
  await user.tab();

  // 비밀번호 입력 필드 확인
  const passwordInput = screen.getByLabelText("비밀번호");
  expect(passwordInput).toHaveFocus();
  // 비밀번호 입력
  await user.type(passwordInput, "password123");
  // 비밀번호 필드에서 탭 키를 눌러 포커스 이동
  await user.tab();
  // X 버튼 부분에 focus 되어 한 번 더 탭 키를 눌러 포커스 이동
  await user.tab();

  // 확인 비밀번호 입력 필드 확인
  const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");
  expect(confirmPasswordInput).toHaveFocus();
  // 확인 비밀번호 입력
  await user.type(confirmPasswordInput, "password123");
  // 확인 비밀번호 필드에서 탭 키를 눌러 포커스 이동
  await user.tab();
  // X 버튼 부분에 focus 되어 한 번 더 탭 키를 눌러 포커스 이동
  await user.tab();

  // 제출 이벤트 발생
  const signupButton = screen.getByRole("button", { name: "회원가입" });
  expect(signupButton).toHaveFocus();
  await user.keyboard("{Enter}");

  // 콘솔 로그 확인
  expect(alertSpy).toHaveBeenCalledWith("test@example.com님 반갑습니다.");

  // jest.spyOn()으로 생성된 스파이(spy)를 원래 구현(original implementation)으로 완전히 복원하는 역할
  alertSpy.mockRestore();
});
