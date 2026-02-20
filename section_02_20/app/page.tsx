export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-indigo-100">
      {/* 헤더 섹션 */}
      <header className="container mx-auto px-4 py-6">
        {/* 좌우 정렬 */}
        <nav className="flex justify-between">
          <div className="text-xl font-bold text-indigo-600">내 포트폴리오</div>
          {/* 좌우 정렬 및 간격 */}
          <ul className="flex gap-5">
            <li>
              <a
                href="#about"
                className="text-gray-600 transition-colors hover:text-indigo-600"
              >
                소개
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className="text-gray-600 transition-colors hover:text-indigo-600"
              >
                프로젝트
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-gray-600 transition-colors hover:text-indigo-600"
              >
                연락처
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* 히어로 섹션 */}
      {/* 중앙 정렬 및 텍스트 가운데 정렬 */}
      <section className="container mx-auto flex flex-col items-center px-4 py-16 text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-indigo-200">
          <span className="text-4xl">👋</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          안녕하세요, 저는 홍길동입니다
        </h1>
        <p className="mb-8 max-w-2xl text-center text-xl text-gray-600">
          프론트엔드 개발에 관심이 많은 주니어 개발자입니다. Next.js와 Tailwind
          CSS를 배우고 있습니다.
        </p>
        <button className="transform rounded-lg bg-indigo-600 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-indigo-700">
          연락하기
        </button>
      </section>

      {/* 소개 섹션 */}
      <section id="about" className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
          소개
        </h2>
        {/* 작은 브라우저 사이즈: 1열 & md 이상: 2열 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-indigo-600">
              내 스킬
            </h3>

            {/* 너비가 작을 때, 벗어나지 않게 하기  */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800">
                HTML
              </span>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800">
                CSS
              </span>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800">
                JavaScript
              </span>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800">
                React
              </span>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800">
                Next.js
              </span>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800">
                Tailwind CSS
              </span>
            </div>
          </div>
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-indigo-600">
              내 취미
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✨</span> 코딩하기
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">📚</span> 기술 책 읽기
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">🎮</span> 게임하기
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">🏃‍♂️</span> 조깅하기
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 프로젝트 섹션 */}
      <section
        id="projects"
        className="container mx-auto rounded-t-3xl bg-white px-4 py-16 shadow-inner"
      >
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
          프로젝트
        </h2>
        {/* 기본: 1열 */}
        {/* md 이상: 3열 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* 프로젝트 카드 1 */}
          <div className="group overflow-hidden rounded-xl bg-gray-50 shadow-lg transition-all hover:shadow-xl">
            <div className="flex h-48 items-center justify-center bg-indigo-200">
              <span className="text-4xl">🚀</span>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-gray-800 transition-colors group-hover:text-indigo-600">
                포트폴리오 웹사이트
              </h3>
              <p className="mb-4 text-gray-600">
                Next.js와 Tailwind CSS를 이용한 개인 포트폴리오 웹사이트입니다.
              </p>
              {/* 너비가 작을 때, 벗어나지 않게 하기  */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-gray-200 px-2 py-1 text-xs">
                  Next.js
                </span>
                <span className="rounded bg-gray-200 px-2 py-1 text-xs">
                  Tailwind
                </span>
              </div>
            </div>
          </div>

          {/* 프로젝트 카드 2 */}
          <div className="group overflow-hidden rounded-xl bg-gray-50 shadow-lg transition-all hover:shadow-xl">
            <div className="flex h-48 items-center justify-center bg-indigo-200">
              <span className="text-4xl">📝</span>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-gray-800 transition-colors group-hover:text-indigo-600">
                할 일 관리 앱
              </h3>
              <p className="mb-4 text-gray-600">
                React를 이용한 간단한 할 일 관리 애플리케이션입니다.
              </p>
              {/* 너비가 작을 때, 벗어나지 않게 하기  */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-gray-200 px-2 py-1 text-xs">
                  React
                </span>
                <span className="rounded bg-gray-200 px-2 py-1 text-xs">
                  CSS
                </span>
              </div>
            </div>
          </div>

          {/* 프로젝트 카드 3 */}
          <div className="group overflow-hidden rounded-xl bg-gray-50 shadow-lg transition-all hover:shadow-xl">
            <div className="flex h-48 items-center justify-center bg-indigo-200">
              <span className="text-4xl">🌦️</span>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-gray-800 transition-colors group-hover:text-indigo-600">
                날씨 앱
              </h3>
              <p className="mb-4 text-gray-600">
                JavaScript와 날씨 API를 이용한 간단한 날씨 정보 웹사이트입니다.
              </p>
              {/* 너비가 작을 때, 벗어나지 않게 하기  */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-gray-200 px-2 py-1 text-xs">
                  HTML
                </span>
                <span className="rounded bg-gray-200 px-2 py-1 text-xs">
                  CSS
                </span>
                <span className="rounded bg-gray-200 px-2 py-1 text-xs">
                  JavaScript
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 연락처 섹션 */}
      <section id="contact" className="container mx-auto bg-white px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
          연락처
        </h2>
        <div className="mx-auto max-w-md rounded-xl bg-gray-50 p-8 shadow-lg">
          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-gray-700" htmlFor="name">
                이름
              </label>
              <input
                type="text"
                id="name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="mb-2 block text-gray-700" htmlFor="email">
                이메일
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-gray-700" htmlFor="message">
                메시지
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="메시지를 입력하세요..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
            >
              보내기
            </button>
          </form>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-800 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© 2025 내 포트폴리오. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="transition-colors hover:text-indigo-400">
              Twitter
            </a>
            <a href="#" className="transition-colors hover:text-indigo-400">
              GitHub
            </a>
            <a href="#" className="transition-colors hover:text-indigo-400">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
