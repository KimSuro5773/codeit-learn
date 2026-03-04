// discountCalculator.js

function calculatePrice(price, membership = "regular", coupon = null) {
  // 1. 가격에 따라 할인율을 적용
  const priceAfterPriceDiscount = applyPriceDiscount(price);

  // 2. 회원 등급에 따라 추가 할인 적용
  const priceAfterMembershipDiscount = applyMembershipDiscount(priceAfterPriceDiscount, membership);

  // 3. 쿠폰 할인 적용
  const priceAfterCouponDiscount = applyCouponDiscount(priceAfterMembershipDiscount, coupon);

  // 4. 최소 가격 제한 적용
  const finalPrice = applyMinimumPriceLimit(priceAfterCouponDiscount, price);
  // 5. 최종 가격 반환
  return finalPrice;
}

function applyPriceDiscount(price) {
  if (price >= 200000) return price * 0.8; // 20% 할인
  if (price >= 100000) return price * 0.9; // 10% 할인
  if (price >= 50000) return price * 0.95; // 5% 할인
  return price;
}

function applyMembershipDiscount(price, membership) {
  if (membership === "silver") {
    return price * 0.98; // 실버 회원 2% 추가 할인
  } else if (membership === "gold") {
    return price * 0.95; // 골드 회원 5% 추가 할인
  } else if (membership === "vip") {
    return price * 0.9; // VIP 회원 10% 추가 할인
  }
  return price; // 일반 회원은 할인 없음
}

function applyCouponDiscount(price, coupon) {
  if (!coupon) return price; // 쿠폰이 없으면 할인 없음
  if (coupon.type === "percentage") {
    return price * (1 - coupon.amount / 100); // 비율 쿠폰 적용
  }
  if (coupon.type === "fixed") {
    return price - coupon.amount; // 정액 쿠폰 적용
  }
  return price; // 잘못된 쿠폰 타입은 할인 없음
}

function applyMinimumPriceLimit(discountedPrice, originalPrice) {
  return Math.max(discountedPrice, originalPrice * 0.5); // 최소 가격 할인 적용
}

module.exports = { calculatePrice };
