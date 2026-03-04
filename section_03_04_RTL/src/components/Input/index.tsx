// src/components/Input/index.tsx

"use client";

import { useState } from "react";
import { DeleteIconButton } from "./DeleteIconButton";

interface InputProps {
  id?: string;
  name?: string;
  defaultValue?: string;
  type?: "text" | "password" | "email" | "number"; // 필요한 타입을 추가할 수 있습니다.
  placeholder?: string;
  isError?: boolean;
  errorMessage?: string;
  // 추가적인 props가 필요하다면 여기에 정의할 수 있습니다.
}
export const Input = ({
  id,
  name,
  defaultValue = "",
  type = "text",
  placeholder,
  isError = false,
  errorMessage,
}: InputProps) => {
  const [value, setValue] = useState(defaultValue);
  const borderColor = isError ? "border-red-500" : "border-gray-300";
  return (
    <>
      <div className="relative inline-block w-full">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`p-2 pr-8 border ${borderColor} rounded-md w-full`}
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            aria-label="입력값 지우기"
          >
            <DeleteIconButton />
          </button>
        )}
      </div>
      {isError && <span className="mt-1 text-sm ml-1 text-red-500">{errorMessage}</span>}
    </>
  );
};
