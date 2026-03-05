// src/components/PassowordInput/index.tsx

"use client";

import { useState } from "react";

export const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <input placeholder="비밀번호를 입력하세요." type={showPassword ? "text" : "password"} />
      <button onClick={handleShowPassword}>{showPassword ? "숨기기" : "보기"}</button>
    </div>
  );
};
