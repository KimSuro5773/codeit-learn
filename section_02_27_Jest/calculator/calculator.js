// calculator.js

function calculateTotal(price, quantity, discount = 0) {
  return price * quantity * (1 - discount);
}

function calculateDiscountedPrice(originalPrice, discountPercentage) {
  if (originalPrice < 0 || discountPercentage < 0 || discountPercentage > 100) {
    throw new Error(
      "입력값이 유효하지 않습니다. 가격과 할인율은 0 이상이어야 하며, 할인율은 100 이하이어야 합니다.",
    );
  }
  const discount = originalPrice * (discountPercentage / 100);
  return originalPrice - discount;
}

module.exports = { calculateTotal, calculateDiscountedPrice };
