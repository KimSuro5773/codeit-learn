// payment.test.js
const { processPayment } = require("./payment");
const logger = require("./logger");

jest.mock("./logger");

describe("payment.js 테스트", () => {
  test("결제 금액 0 이하일 때 결제 실패 시 로그 확인", () => {
    processPayment(0);
    expect(logger.error).toHaveBeenCalledWith(
      "결제 처리 중 오류 발생: 결제 금액은 0보다 커야 합니다.",
    );
  });

  test("지원하지 않는 결제 방식일 때 로그 확인", () => {
    processPayment(10000, "USD", "잘못된 결제 방식");
    expect(logger.error).toHaveBeenCalledWith(
      "결제 처리 중 오류 발생: 지원하지 않는 결제 방식입니다. 지원 방식: card, bank, mobile",
    );
  });
});
