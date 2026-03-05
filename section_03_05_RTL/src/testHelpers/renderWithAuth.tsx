// src/testHelpers/renderWithTheme.tsx

import { ThemeContext, ThemeContextType, ThemeProvider } from "@/context/ThemeContext";
import { render } from "@testing-library/react";

import { ReactElement } from "react";

// 기본 ThemeContext 값 정의
const defaultThemeValue: ThemeContextType = {
  theme: "light",
  toggleTheme: () => {},
};

const renderWithTheme = (ui: ReactElement, themeValue?: Partial<ThemeContextType>) => {
  return render(
    themeValue ? (
      <ThemeContext.Provider value={{ ...defaultThemeValue, ...themeValue }}>
        {ui}
      </ThemeContext.Provider>
    ) : (
      <ThemeProvider>{ui}</ThemeProvider>
    ),
  );
};

export { renderWithTheme };
