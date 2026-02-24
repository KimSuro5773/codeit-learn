// src/providers/LazyMotionProvider.tsx

"use client";

import { LazyMotion } from "motion/react";

const loadFeatures = () =>
  import("../../lib/feature").then((res) => res.default);

export default function LazyMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
  // return <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>;
}

// `LazyMotion` 컴포넌트로 감싸고 필요한 기능 (features) 전달
//     - `domAnimation`: hover, focus, transition, animate 등 일반적인 애니메이션 기능
//     - `domMax`: domAnimation 기능을 포함한 드래그, 레이아웃 등 추가 애니메이션 기능

// LazyMotion 내에 motion 컴포넌트를 사용한다면 최적화가 소용이 없어진다.
// 그래서 motion 컴포넌트를 내부에 두지 못하도록 strict 모드를 설정할 수 있다.
