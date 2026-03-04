// max.test.js
const { findMax } = require("./max");

describe("findMax", () => {
  test("배열에서 가장 큰 수를 반환해야 한다", () => {
    expect(findMax([1, 3, 2])).toBe(3);
  });

  test("다른 배열에서도 최댓값을 찾아야 한다", () => {
    expect(findMax([5, 1, 9, 3])).toBe(9);
  });

  test("음수가 포함된 배열도 처리해야 한다", () => {
    expect(findMax([-1, -5, -2])).toBe(-1);
  });

  test("빈 배열일 때 undefined를 반환해야 한다", () => {
    expect(findMax([])).toBeUndefined();
  });

  test("null이나 undefined 입력시 undefined를 반환해야 한다", () => {
    expect(findMax(null)).toBeUndefined();
    expect(findMax(undefined)).toBeUndefined();
  });
});
