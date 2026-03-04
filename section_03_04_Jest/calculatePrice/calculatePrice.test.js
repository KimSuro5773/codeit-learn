const { calculatePrice } = require("./calculatePrice");

describe("calculatePrice 테스트", () => {
  describe("상품 가격에 따른 금액 할인 테스트", () => {
    test("5만원 미만일 시 금액 할인이 적용되지 않는다.", () => {
      const price = 40_000;

      const result = calculatePrice(price);

      expect(result).toBe(40_000);
    });

    test("5만원 이상일 시 5%의 금액 할인이 적용된다.", () => {
      const price = 50_000;

      const result = calculatePrice(price);

      expect(result).toBe(47_500);
    });

    test("10만원 이상일 시 10%의 금액 할인이 적용된다.", () => {
      const price = 100_000;

      const result = calculatePrice(price);

      expect(result).toBe(90_000);
    });

    test("20만원 이상일 시 20%의 금액 할인이 적용된다.", () => {
      const price = 200_000;

      const result = calculatePrice(price);

      expect(result).toBe(160_000);
    });
  });

  describe("회원 등급에 따른 추가 할인 테스트", () => {
    test("회원 등급이 일반 회원일 경우 할인이 적용 되지 않는다", () => {
      const price = 10_000;
      const membership = "nomal";

      const result = calculatePrice(price, membership);

      expect(result).toBe(10_000);
    });

    test("회원 등급이 실버 회원일 경우 2% 추가 할인이 적용 된다.", () => {
      const price = 100_000;
      const membership = "silver";

      const result = calculatePrice(price, membership);

      expect(result).toBe(88_200);
    });

    test("회원 등급이 골드 회원일 경우 5% 추가 할인이 적용 된다.", () => {
      const price = 100_000;
      const membership = "gold";

      const result = calculatePrice(price, membership);

      expect(result).toBe(85_500);
    });

    test("회원 등급이 VIP 회원일 경우 10% 추가 할인이 적용 된다.", () => {
      const price = 100_000;
      const membership = "vip";

      const result = calculatePrice(price, membership);

      expect(result).toBe(81_000);
    });
  });

  describe("쿠폰 할인 적용 테스트", () => {
    test("정액 쿠폰 적용 시 쿠폰에 따라 할인이 적용되어야 함", () => {
      const price = 100000;
      const membership = "regular";
      const coupon = {
        type: "fixed",
        amount: 5000, // 1만원 쿠폰
      };

      const finalPrice = calculatePrice(price, membership, coupon);
      expect(finalPrice).toBe(85000); // 100,000 * 0.9 - 5,000
    });

    test("비율 쿠폰 적용 시 쿠폰에 따라 할인이 적용되어야 함", () => {
      const price = 100000;
      const membership = "regular";
      const coupon = {
        type: "percentage",
        amount: 10, // 10% 쿠폰
      };

      const finalPrice = calculatePrice(price, membership, coupon);
      expect(finalPrice).toBe(81000); // 100,000 * 0.9 * 0.9
    });
  });

  describe("최대 할인(50%) 제한 테스트", () => {
    test("최대 할인율이 50%를 초과하지 않도록 테스트", () => {
      const price = 100000; // 10% 할인
      const membership = "vip"; // 10% 추가 할인
      const coupon = {
        type: "percentage",
        amount: 50, // 50% 추가 할인
      };

      const finalPrice = calculatePrice(price, membership, coupon);
      expect(finalPrice).toBe(50000); // 최대 할인 적용 후 50,000
    });
  });
});
