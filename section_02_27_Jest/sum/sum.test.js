// sum.test.js

const { sum } = require("./sum");

test("1 + 2는 3이 되어야 함", () => {
  expect(sum(1, 2)).toBe(3);
});
