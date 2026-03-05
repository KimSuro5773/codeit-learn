// src/components/LoginForm/index.tsx

"use client";

import { useState } from "react";
import { Input } from "../Input";
import { useInputs } from "@/hooks/useInputs/useInputs";

export const LoginForm = () => {
  const { values, handleChange, handleDelete } = useInputs({
    email: "",
    password: "",
  });

  // 유효성 상태 추가
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // 간단한 로그인 성공 여부 모달창 띄우기 (실제로는 따로 개발하는 것이 적절)
  const [showModal, setShowModal] = useState(false);

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string) => {
    if (!email) return "이메일을 입력하세요.";
    // 간단한 이메일 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "올바른 이메일 형식이 아닙니다.";
    return "";
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string) => {
    if (!password) return "비밀번호를 입력하세요.";
    if (password.length < 6) return "비밀번호는 6자 이상이어야 합니다.";
    return "";
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(e);

    // 입력값 변경 시 유효성 검사
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
    if (name === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const onDelete = (field: keyof typeof values) => {
    handleDelete(field);
    setErrors((prev) => ({
      ...prev,
      [field]: field === "email" ? validateEmail("") : validatePassword(""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 처리
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("로그인 요청 실패");
      }

      const data = await response.json();
      if (data.error) {
        alert("로그인 실패: " + data.error);
      } else {
        setShowModal(true);
        // alert("로그인 성공: " + data.message);
      }
    } catch (error) {
      alert("로그인 요청 중 오류 발생: " + error);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 p-6 bg-white">
        <div>
          <label htmlFor="email" className="block mb-2">
            이메일
          </label>
          <Input
            id="email"
            name="email"
            value={values.email}
            onChange={onChange}
            type="email"
            placeholder="이메일을 입력하세요"
            isError={!!errors.email}
            errorMessage={errors.email}
            onDelete={() => onDelete("email")} // X 버튼 클릭 시 이메일 지우기
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2">
            비밀번호
          </label>
          <Input
            id="password"
            name="password"
            value={values.password}
            onChange={onChange}
            type="password"
            placeholder="비밀번호를 입력하세요"
            isError={!!errors.password}
            errorMessage={errors.password}
            onDelete={() => onDelete("password")} // X 버튼 클릭 시 비밀번호 지우기
          />
        </div>
        <button
          disabled={!values.email || !values.password}
          className="bg-blue-500 rounded-md w-full cursor-pointer p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          로그인
        </button>
      </form>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-400">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-lg font-semibold">로그인 성공</h2>
            <p>환영합니다!</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-blue-500 text-white rounded-md px-4 py-2"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};
