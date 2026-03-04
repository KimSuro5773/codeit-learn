// src/components/ProductItem/index.tsx

interface ProductItemProps {
  title: string;
  description: string;
  // 품절 여부
  isSoldOut?: boolean;
}

export default function ProductItem({ title, description, isSoldOut = false }: ProductItemProps) {
  return (
    <div className="max-w-2xl mx-auto my-5 p-5">
      <div className="flex gap-5 border border-gray-300 rounded-lg p-5 bg-white">
        {/* 좌측: 상품 이미지 (회색 사각형) */}
        <div className="w-44 h-44 bg-gray-400 rounded shrink-0"></div>

        {/* 우측: 상품 정보 */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
            <p className="m-0 text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* 상품 개수 조절 */}
          <div className="flex items-center gap-3">
            {isSoldOut ? (
              <span className="text-red-500 w-26 h-8">품절</span>
            ) : (
              <>
                <button className="w-8 h-8 border border-gray-300 bg-white rounded cursor-pointer text-lg flex items-center justify-center hover:bg-gray-100">
                  -
                </button>
                <span className="min-w-10 text-center text-base font-medium">1</span>
                <button className="w-8 h-8 border border-gray-300 bg-white rounded cursor-pointer text-lg flex items-center justify-center hover:bg-gray-100">
                  +
                </button>
              </>
            )}
          </div>

          {/* 구매하기 버튼 */}
          <button
            disabled={isSoldOut}
            className={`${isSoldOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-blue-700"} w-full py-3 bg-blue-600 text-white border-0 rounded text-base font-semibold`}
          >
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}
