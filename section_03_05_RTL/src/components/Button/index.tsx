// src/components/Button/index.tsx

"use client";

export function Button({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="bg-blue-400 px-4 py-2 rounded-md text-white cursor-pointer"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
