"use client";

import { motion } from "motion/react";

export default function ScrollCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div className="h-64 rounded-xl bg-gray-400 p-6">
      {children}
    </motion.div>
  );
}
