// fetchMock.test.js
const { fetchUserData } = require("./fetchMock");

test("사용자 데이터를 성공적으로 가져오는 경우 - Promise 방식", () => {
  const mockUserData = { id: 1, name: "철수", email: "abc@naver.com" };

  // 1. fetch API 모킹하기
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(mockUserData),
  });

  // 2. Promise 방식으로 테스트
  return expect(fetchUserData(1)).resolves.toEqual(mockUserData);
});

test("네트워크 오류 발생 시 에러 처리 - Promise 방식", () => {
  // 1. fetch가 거부된 Promise를 반환하도록 모킹
  global.fetch = jest.fn().mockRejectedValue(new Error("Network Error"));

  // 2. 최소 1개의 assertion이 필요
  expect.assertions(1);

  // 3. Promise 방식으로 에러 처리 테스트
  return expect(fetchUserData(1)).rejects.toThrow("Network Error");
});
