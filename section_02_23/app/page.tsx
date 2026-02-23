// app/page.tsx

import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Link className="text-blue-500 underline" href="/about">
        About으로
      </Link>
      {/* 코드 생략*/}
    </div>
  );
}
