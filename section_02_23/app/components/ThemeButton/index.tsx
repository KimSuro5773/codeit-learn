"use client";

import { useTheme } from "next-themes";

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex w-full justify-end gap-4">
      <button
        className="rounded-lg border border-gray-300 px-3 py-2 dark:text-white"
        onClick={() => setTheme("system")}
      >
        시스템
      </button>
      <button
        className="rounded-lg border border-gray-300 px-3 py-2 dark:text-white"
        onClick={() => setTheme("dark")}
      >
        다크
      </button>
      <button
        className="rounded-lg border border-gray-300 px-3 py-2 dark:text-white"
        onClick={() => setTheme("light")}
      >
        라이트
      </button>
    </div>
  );
}
