// src/components/InViewSlideSection/index.tsx

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface InViewSlideSectionProps {
  children: React.ReactNode;
  direction: "left" | "top" | "bottom";
  className?: string;
}

export default function InViewSlideSection({
  children,
  direction,
  className = "",
}: InViewSlideSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.8, // 80% 가 보일 때 애니메이션 시작
  });

  // animate에 넣을 이름(hidden, visible)을 정의하고, 그에 맞는 css 설정
  const variants = {
    hidden: {
      // 안보이게
      opacity: 0,
      // left 일 때 왼쪽으로 100px 밀리게
      x: direction === "left" ? -100 : 0,
      // top 일 때 위로 100px 밀리게, bottom 일 때 아래로 100px 밀리게
      y: direction === "top" ? -100 : direction === "bottom" ? 100 : 0,
    },
    visible: {
      // visible이면 보이고, 원래 자기 자리로
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      // 초기엔 안보이게
      initial="hidden"
      // isInView에 따라 visible, hidden 속성 달라지게
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
