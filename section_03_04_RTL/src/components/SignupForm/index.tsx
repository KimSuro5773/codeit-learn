// src/components/SignupForm/index.tsx

export default function SignupForm() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-4 text-center">회원가입</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="이메일"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="비밀번호"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="비밀번호 확인"
          />
        </div>
        <button
          className="w-full h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
