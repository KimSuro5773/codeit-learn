// src/app/page.tsx

"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";

const RecentProducts = dynamic(() => import("@/components/RecentProducts"), {
  ssr: false,
});

const products = [
  { id: 1, name: "노트북" },
  { id: 2, name: "스마트폰" },
  { id: 3, name: "태블릿" },
  { id: 4, name: "이어폰" },
  { id: 5, name: "키보드" },
];

export default function Home() {
  const [recentProducts, setRecentProducts] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const cookieValue = Cookies.get("recentProducts");
      if (cookieValue) {
        return JSON.parse(cookieValue);
      } else {
        return [];
      }
    }

    return [];
  });

  const handleProductClick = (productName: string) => {
    const updated = [
      productName,
      ...recentProducts.filter((name) => name !== productName),
    ];
    setRecentProducts(updated);
    Cookies.set("recentProducts", JSON.stringify(updated));
  };

  return (
    <div className="relative">
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold">상품 목록</h1>
        <ul className="flex flex-wrap gap-4">
          {products.map((product) => (
            <li key={product.id}>
              <button
                onClick={() => handleProductClick(product.name)}
                className="cursor-pointer rounded border p-4 hover:bg-gray-100"
              >
                {product.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="fixed top-4 right-4 rounded bg-blue-500 p-4 text-white shadow-lg">
        <div className="mb-2 font-bold">최근 본 상품</div>
        <RecentProducts recentProducts={recentProducts} />
      </div>
    </div>
  );
}
