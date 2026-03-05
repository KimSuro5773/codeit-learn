// src/components/ThemeToggle/index.tsx

"use client";

import { useTheme } from "@/context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-4">
      <button
        onClick={toggleTheme}
        className={`${
          theme === "light"
            ? "rounded-md bg-gray-200 px-4 py-2 text-black hover:bg-gray-300"
            : "rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
        }`}
      >
        {theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      </button>
    </div>
  );
};
