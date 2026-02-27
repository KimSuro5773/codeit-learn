// cart.test.js

const { filterCartItems } = require("./cart.js");

const cart = [
  { name: "노트북", price: 1000 },
  { name: "마우스", price: 50 },
  { name: "키보드", price: 80 },
];

describe("filterCartItems 테스트", () => {
  test("노트북을 필터링 했을 때 노트북이 제대로 들어가는지 확인", () => {
    expect(filterCartItems(cart, "노트북")).toContain(cart[0]);
  });

  test("휴대폰을 필터링 했을 때 노트북이 존재하지 않은지", () => {
    expect(filterCartItems(cart, "휴대폰")).not.toContain(cart[0]);
  });

  test("마우스를 필터링 했을 때 정확한 아이템 객체를 반환하는지 확인", () => {
    expect(filterCartItems(cart, "마우스")).toEqual([{ name: "마우스", price: 50 }]);
  });
});
