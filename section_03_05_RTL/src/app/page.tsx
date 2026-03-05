// app/page.tsx

"use client";

import useCounterStore from "@/stores/useCounterStore";

export default function Home() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <div className="flex h-screen gap-2 items-center justify-center">
      <button className="bg-red-500 text-white p-2 rounded-md" onClick={decrement}>
        감소
      </button>
      <p>Count: {count}</p>
      <button className="bg-blue-500 text-white p-2 rounded-md" onClick={increment}>
        증가
      </button>
    </div>
  );
}
