// src/components/ThemeToggle/index.test.tsx

import { screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { renderWithTheme } from "@/testHelpers/renderWithAuth";

describe("ThemeToggle 테스트", () => {
  test("라이트 모드 버튼 초기 렌더링", () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByText("다크 모드로 전환")).toBeInTheDocument();
  });

  test("다크 모드 버튼 초기 렌더링", () => {
    renderWithTheme(<ThemeToggle />, { theme: "dark" });
    expect(screen.getByText("라이트 모드로 전환")).toBeInTheDocument();
  });

  test("다크 모드 버튼 클릭 시 라이트 모드로 전환", async () => {
    renderWithTheme(<ThemeToggle />);

    const toggleButton = screen.getByText("다크 모드로 전환");

    fireEvent.click(toggleButton);

    expect(screen.getByText("라이트 모드로 전환")).toBeInTheDocument();
  });
});
