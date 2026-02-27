const logger = require("./logger");

// payment.js
function processPayment(amount, currency = "KRW", method = "card") {
  try {
    if (amount <= 0) {
      throw new Error("결제 금액은 0보다 커야 합니다.");
    }

    const supportedMethods = ["card", "bank", "mobile"];
    if (!supportedMethods.includes(method)) {
      throw new Error(`지원하지 않는 결제 방식입니다. 지원 방식: ${supportedMethods.join(", ")}`);
    }

    console.log(
      `${amount}${
        currency === "KRW" ? "원" : currency
      }이 ${method} 방식으로 성공적으로 결제 완료됐습니다.`,
    );
  } catch (error) {
    logger.error(`결제 처리 중 오류 발생: ${error.message}`);
  }
}

module.exports = { processPayment };

// 아래의 주석을 풀고 실행하면 로그 파일이 생성됩니다.
// processPayment(10000, "KRW", "잘못된 결제 방식");
