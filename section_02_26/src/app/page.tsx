"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

type Item = {
  id: number;
  name: string;
};

export type CartItem = Item & {
  count: number;
};

const ITEMS = [
  {
    id: 1,
    name: "사과",
  },
  {
    id: 2,
    name: "오렌지",
  },
  {
    id: 3,
    name: "딸기",
  },
];

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const initializeCartItems = () => {
      const cartItem = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
      setCartItems(cartItem);
    };
    initializeCartItems();
  }, []);

  const handleAddItem = (item: Item) => {
    // 1. 중복 여부 확인
    const isExist = cartItems.find((cartItem) => cartItem.id === item.id);
    // 2. 중복이 있다면 개수를 증가
    if (isExist) {
      const updateCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, count: cartItem.count + 1 }
          : cartItem,
      );
      sessionStorage.setItem("cartItems", JSON.stringify(updateCartItems));
      setCartItems(updateCartItems);
    } else {
      // 3. 아니라면 그냥 추가
      const updateCartItems = [...cartItems, { ...item, count: 1 }];

      sessionStorage.setItem("cartItems", JSON.stringify(updateCartItems));
      setCartItems(updateCartItems);
    }
  };

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">코드잇 마켓</h1>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        {ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex w-full items-center justify-between gap-2 rounded-md bg-gray-100 px-8 py-4"
          >
            <span>{item.name}</span>
            <button
              onClick={() => handleAddItem(item)}
              className="cursor-pointer rounded-md bg-gray-300 px-4 py-3 hover:bg-gray-400"
            >
              담기
            </button>
          </div>
        ))}
      </div>
      <div className="w-full">장바구니: {cartItems.length}개</div>
      <Link
        href="/cart"
        className="w-full rounded-md bg-indigo-500 px-4 py-3 text-white"
      >
        장바구니로 가기
      </Link>
    </div>
  );
}
