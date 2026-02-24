"use client";

import * as motion from "motion/react-client";
import { useState } from "react";

export default function LayoutAnimation() {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => setIsOn(!isOn);

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        className={`flex h-18 w-32 cursor-pointer rounded-full bg-purple-800 p-3 ${
          isOn ? "justify-start" : "justify-end"
        }`}
        onClick={toggleSwitch}
      >
        <motion.div
          className="h-12 w-12 rounded-full bg-purple-500"
          layout
          transition={{
            type: "spring",
            stiffness: 200, // 강도
            damping: 20, // 감쇠
          }}
        />
      </button>
    </div>
  );
}
