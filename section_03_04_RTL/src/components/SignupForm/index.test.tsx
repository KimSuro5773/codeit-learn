import { render, screen } from "@testing-library/react";
import SignupForm from ".";

describe("회원가입 폼 테스트", () => {
  beforeEach(() => {
    render(<SignupForm />);
  });

  test("이메일, 비밀번호, 비밀번호 확인 입력 필드가 제대로 렌더링이 된다.", () => {
    const emailInput = screen.getByLabelText("이메일");
    const passwordInput = screen.getByLabelText("비밀번호");
    const rePasswordInput = screen.getByLabelText("비밀번호 확인");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(rePasswordInput).toBeInTheDocument();
  });

  test("비밀번호, 비밀번호 확인 입력 필드의 type이 password이다.", () => {
    const passwordInput = screen.getByPlaceholderText("비밀번호");
    const rePasswordInput = screen.getByPlaceholderText("비밀번호 확인");

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(rePasswordInput).toHaveAttribute("type", "password");
  });

  test("회원가입 버튼이 렌더링 되어야 한다.", () => {
    const signUpButton = screen.getByRole("button", { name: "회원가입" });

    expect(signUpButton).toBeInTheDocument();
  });
});
