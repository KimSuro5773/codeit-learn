// src/hooks/useInputs.ts

import { useState } from "react";

// 제네릭 타입 T는 Record<string, unknown> 타입이거나 그 하위 타입이어야 한다.
// T는 실행 시점의 타입을 기억(캡쳐)한다.
export const useInputs = <T extends Record<string, unknown>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (field: keyof T) => {
    setValues((prev) => ({ ...prev, [field]: "" }));
  };

  return {
    values,
    handleChange,
    handleDelete,
  };
};
