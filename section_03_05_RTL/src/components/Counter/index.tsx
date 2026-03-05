// src/components/Counter/index.tsx
"use client";

import { useCounter } from "@/hooks/useCounter/useCounter";

export const Counter = () => {
  const { count, increment, decrement, reset } = useCounter(0);
  return (
    <div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        onClick={decrement}
      >
        -
      </button>
      <span className="mt-4 text-center text-xl font-bold mx-4">{count}</span>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        onClick={increment}
      >
        +
      </button>
      <div>
        <button className="bg-gray-300 text-black px-4 py-2 rounded mt-4" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};
