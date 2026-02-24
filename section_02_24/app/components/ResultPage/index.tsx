"use client";

import { motion } from "motion/react";

export default function ResultPage({ answers }: { answers: string[] }) {
  return (
    <motion.div
      className="text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="mb-6 text-3xl font-bold"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        테스트 결과
      </motion.h2>
      <motion.div
        className="rounded-lg bg-white p-6 shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {answers.map((answer, index) => (
          <motion.p
            key={index}
            className="mb-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            질문 {index + 1}: {answer}
          </motion.p>
        ))}
      </motion.div>
    </motion.div>
  );
}
