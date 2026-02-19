// src/app/page.tsx

import Card from "./components/Card";

export default function Home() {
  return (
    <div className="space-y-2 p-4">
      {/* 기본 사용 */}
      <Card>
        <h2 className="mb-4 text-xl font-bold">제목</h2>
        <p className="text-gray-600">내용</p>
      </Card>
      {/* 옵션 지정 */}
      <Card variant="outlined" padding="lg" radius="lg">
        <h2 className="mb-4 text-xl font-bold">제목</h2>
        <p className="text-gray-600">내용</p>
      </Card>
      {/* 외부 className 추가 (tailwind-merge 덕분에 충돌 없이 적용) */}
      <Card variant="elevated" className="max-w-lg bg-red-100">
        <h2 className="mb-4 text-xl font-bold">제목</h2>
        <p className="text-gray-600">내용</p>
      </Card>
    </div>
  );
}
