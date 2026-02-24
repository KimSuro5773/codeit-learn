"use client";

import { animate } from "motion";
import { useMotionValue, motion, useTransform } from "motion/react";
import { useEffect } from "react";

export default function Counter() {
  const motionValue = useMotionValue(0);

  const toFixed = useTransform(motionValue, (latest) => latest.toFixed(0));

  useEffect(() => {
    const control = animate(motionValue, 100, { duration: 2 });
    return () => control.stop();
  }, [motionValue]);

  return (
    <div className="flex h-screen items-center justify-center">
      <motion.pre className="text-4xl">{toFixed}</motion.pre>
    </div>
  );
}
