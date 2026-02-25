// src/components/RecentProducts/index.tsx

"use client";

export default function RecentProducts({
  recentProducts,
}: {
  recentProducts: string[];
}) {
  return (
    <ul className="space-y-1">
      {recentProducts.length > 0 &&
        recentProducts.map((product, index) => <li key={index}>{product}</li>)}
    </ul>
  );
}
