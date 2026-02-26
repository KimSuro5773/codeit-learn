// calculator.test.js

const { calculateTotal, calculateDiscountedPrice } = require("./calculator");

// calculateTotal 테스트
describe("calculator.js 테스트", () => {
  describe("calculateTotal 테스트", () => {
    test("기본 계산 - 1000원 상품 2개의 가격은 2000원이 나오는지 확인", () => {
      expect(calculateTotal(1000, 2)).toBe(2000);
    });

    test("할인 적용 - 1000원 상품 2개를 10% 할인하면 1800원이 나오는지 확인", () => {
      expect(calculateTotal(1000, 2, 0.1)).toBe(1800);
    });

    test("기본 계산 - 2000원 상품 4개의 가격은 8000원이 나오는지 확인", () => {
      expect(calculateTotal(2000, 4)).toBe(8000);
    });

    test("할인율 적용 - 5000원 상품 3개를 50% 할인하면 7500원이 나오는지 확인", () => {
      expect(calculateTotal(5000, 3, 0.5)).toBe(7500);
    });

    test("할인율이 0인 경우 - 3000원 상품 2개를 0% 할인하면 6000원이 나오는지 확인", () => {
      expect(calculateTotal(3000, 2, 0)).toBe(6000);
    });
  });

  describe("calculateDiscountedPrice 함수 테스트", () => {
    // calculateDiscountedPrice 테스트
    test("20% 할인 적용 시 올바른 결과를 반환하는지 확인", () => {
      expect(calculateDiscountedPrice(100, 20)).toBe(80);
    });

    test("유효한 입력에 대해 0보다 큰 숫자를 반환하는지 확인", () => {
      expect(calculateDiscountedPrice(50, 10)).toBeGreaterThan(0);
    });

    test("원래 가격보다 작은 숫자를 반환하는지 확인", () => {
      expect(calculateDiscountedPrice(200, 25)).toBeLessThan(200);
    });

    test("음수 할인에 대해 오류를 발생시키는지 확인", () => {
      expect(() => calculateDiscountedPrice(100, -10)).toThrow(
        "입력값이 유효하지 않습니다. 가격과 할인율은 0 이상이어야 하며, 할인율은 100 이하이어야 합니다.",
      );
    });
  });
});
