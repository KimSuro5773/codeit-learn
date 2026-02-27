// calculator.test.js

const { calculateTotal, calculateDiscountedPrice } = require("./calculator");

describe("calculator.js 테스트", () => {
  describe("calculateTotal 함수", () => {
    test("기본 계산 - 1000원 상품 2개의 가격은 2000원이 나오는지 확인", () => {
      // Arrange
      const price = 1000;
      const quantity = 2;

      // Act
      const result = calculateTotal(price, quantity);

      // Assert
      expect(result).toBe(2000);
    });

    test("할인 적용 - 1000원 상품 2개를 10% 할인하면 1800원이 나오는지 확인", () => {
      // Arrange
      const price = 1000;
      const quantity = 2;
      const discountRate = 0.1;

      // Act
      const result = calculateTotal(price, quantity, discountRate);

      // Assert
      expect(result).toBe(1800);
    });

    test("기본 계산 - 2000원 상품 4개의 가격은 8000원이 나오는지 확인", () => {
      // Arrange
      const price = 2000;
      const quantity = 4;

      // Act
      const result = calculateTotal(price, quantity);

      // Assert
      expect(result).toBe(8000);
    });

    test("할인율 적용 - 5000원 상품 3개를 50% 할인하면 7500원이 나오는지 확인", () => {
      // Arrange
      const price = 5000;
      const quantity = 3;
      const discountRate = 0.5;

      // Act
      const result = calculateTotal(price, quantity, discountRate);

      // Assert
      expect(result).toBe(7500);
    });

    test("할인율이 0인 경우 - 3000원 상품 2개를 0% 할인하면 6000원이 나오는지 확인", () => {
      // Arrange
      const price = 3000;
      const quantity = 2;
      const discountRate = 0;

      // Act
      const result = calculateTotal(price, quantity, discountRate);

      // Assert
      expect(result).toBe(6000);
    });
  });

  describe("calculateDiscountedPrice 함수", () => {
    test("20% 할인 적용 시 올바른 결과를 반환하는지 확인", () => {
      // Arrange
      const price = 100;
      const discountPercent = 20;

      // Act
      const result = calculateDiscountedPrice(price, discountPercent);

      // Assert
      expect(result).toBe(80);
    });

    test("유효한 입력에 대해 0보다 큰 숫자를 반환하는지 확인", () => {
      // Arrange
      const price = 50;
      const discountPercent = 10;

      // Act
      const result = calculateDiscountedPrice(price, discountPercent);

      // Assert
      expect(result).toBeGreaterThan(0);
    });

    test("원래 가격보다 작은 숫자를 반환하는지 확인", () => {
      // Arrange
      const price = 200;
      const discountPercent = 25;

      // Act
      const result = calculateDiscountedPrice(price, discountPercent);

      // Assert
      expect(result).toBeLessThan(200);
    });

    test("음수 할인에 대해 오류를 발생시키는지 확인", () => {
      // Arrange
      const price = 100;
      const negativeDiscountPercent = -10;

      // Act & Assert (예외를 테스트할 때는 Act와 Assert가 종종 결합됨)
      expect(() => calculateDiscountedPrice(price, negativeDiscountPercent)).toThrow(
        "입력값이 유효하지 않습니다. 가격과 할인율은 0 이상이어야 하며, 할인율은 100 이하이어야 합니다.",
      );
    });
  });
});
