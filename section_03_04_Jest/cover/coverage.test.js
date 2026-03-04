const { isPositive, calculateGrade } = require("./coverage");

describe("coverage.js 테스트", () => {
  test("양수일 때 true를 반환한다", () => {
    const number = 5;

    const result = isPositive(number);

    expect(result).toBe(true);
  });

  test("0일 때 false를 반환한다", () => {
    const number = 0;

    const result = isPositive(number);

    expect(result).toBe(false);
  });

  test("90점 이상이면 A를 반환한다", () => {
    expect(calculateGrade(95)).toBe("A");
    expect(calculateGrade(90)).toBe("A");
  });

  test("80점 이상이면 B를 반환한다", () => {
    expect(calculateGrade(85)).toBe("B");
    expect(calculateGrade(80)).toBe("B");
  });

  // 일부 분기를 테스트하지 않아 커버리지 감소 -> 주석을 풀고 차이점을 확인해보기
  test("70점 이상이면 C를 반환한다", () => {
    expect(calculateGrade(75)).toBe("C");
    expect(calculateGrade(70)).toBe("C");
  });

  test("70점 미만이면 F를 반환한다", () => {
    expect(calculateGrade(65)).toBe("F");
    expect(calculateGrade(0)).toBe("F");
  });
});
