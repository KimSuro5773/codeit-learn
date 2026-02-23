"use client";

import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="container">
      <button
        className="btn"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        아이콘 버튼
      </button>
      <div className={`menu-container ${isOpen ? "active" : ""}`}>
        <div className="menu-item">메뉴1</div>
        <div className="menu-item">메뉴2</div>
        <div className="menu-item">메뉴3</div>
      </div>
    </div>
  );
}
