// src/components/LikeButton/index.tsx

"use client";

import { useState } from "react";

// [설계 참고]
// 일반적으로는 UI만 만들고, 실제 데이터와 로직은 props를 통해 주입받는 것이 유지보수를 위해 좋습니다.
// 하지만 본 컴포넌트는 독립적인 상태 관리 학습을 위해 내부 State(useState)로 구현되었습니다.
export const LikeButton = () => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div>
      <button
        className={`ml-2 px-2 py-1 rounded-md ${isLiked ? "bg-red-400" : "bg-gray-400"}`}
        onClick={() => setIsLiked(!isLiked)}
      >
        {isLiked ? "좋아요 취소" : "좋아요"}
      </button>
    </div>
  );
};
