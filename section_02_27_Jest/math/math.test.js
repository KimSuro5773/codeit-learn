const { calculator } = require("./math");

describe("calculator.js 테스트", () => {
  test("calculator.add 함수 모킹 테스트", () => {
    calculator.add = jest.fn();

    calculator.add(1, 2);

    expect(calculator.add).toHaveBeenCalled();
    expect(calculator.add).toHaveBeenCalledWith(1, 2);
  });

  test("calculator.subtract 함수 모킹 테스트", () => {
    calculator.subtract = jest.fn().mockReturnValue(1);

    calculator.subtract(5, 3);

    expect(calculator.subtract).toHaveBeenCalled();
    expect(calculator.subtract(5, 3)).toBe(1);
  });

  test("calculator.multiply 함수 모킹 테스트", () => {
    // 여기에 코드 작성
    // 1. calculator.multiply를 spyOn으로 모킹하세요
    // 2. 모킹된 함수가 호출되었는지 검증하세요
    //    -> 이때 첫 번째 인자는 2, 두 번째 인자는 3을 넣어주세요.
    // 3. 호출 결과가 올바르게 계산되는지 검증하세요 (2 * 3 = 6)

    const spyMultiply = jest.spyOn(calculator, "multiply");

    spyMultiply(2, 3);

    expect(spyMultiply).toHaveBeenCalled();
    expect(spyMultiply(2, 3)).toBe(6);
  });
});
