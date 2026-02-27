// mock.test.js

describe("비동기 함수 테스트", () => {
  test("mockRejectedValue 테스트", async () => {
    // new Error("API 호출 실패") 는 catch 문의 (error) 에 들어가는 에러입니다.
    const mockFn = jest.fn().mockRejectedValue(new Error("API 호출 실패"));

    try {
      await mockFn();
      // 이 라인은 실행되지 않아야 함
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe("API 호출 실패");
    }
  });
});
