// apiClient.test.js
const { fetchData } = require("./apiClient");
const axios = require("axios");

jest.mock("axios");

describe("apiClient.js 테스트", () => {
  let callback;

  beforeEach(() => {
    callback = jest.fn();

    axios.get.mockResolvedValue({
      data: {
        id: 1,
        name: "Leanne Graham",
        address: {
          street: "Kulas Light",
          suite: "Apt. 556",
          city: "Gwenborough",
        },
      },
    });
  });

  test("API 호출 후 데이터 포맷이 올바르게 되는지 확인", async () => {
    // Arrange
    const url = "https://jsonplaceholder.typicode.com/users/1";

    // Act
    const result = await fetchData(url);

    // Assert
    expect(result).toEqual({
      userId: 1,
      formattedName: "LEANNE GRAHAM",
      address: "Kulas Light Apt. 556 Gwenborough",
    });
  });

  test("callback 함수가 인자로 들어가면 호출이 되는지 확인", async () => {
    // Arrange
    // 여기서도 URL을 자유롭게 수정해도 괜찮습니다.
    const url = "https://api.example.com/user/1";

    // Act
    await fetchData(url, callback);

    // Assert
    // 가짜 함수인 callback이 호출되었는지 확인
    expect(callback).toHaveBeenCalled();
  });

  test("callback 함수가 포멧된 데이터를 인자로 가지고 호출되는지 확인", async () => {
    // Arrange
    const url = "https://api.example.com/user/1";

    // Act
    await fetchData(url, callback);

    // Assert
    // toHaveBeenCalled는 호출 여부만 확인
    // toHaveBeenCalledWith는 호출된 인자를 확인
    expect(callback).toHaveBeenCalledWith({
      userId: 1,
      formattedName: "LEANNE GRAHAM",
      address: "Kulas Light Apt. 556 Gwenborough",
    });
  });

  test("callback 함수가 한 번 호출되는지 확인", async () => {
    // Arrange
    const url = "https://api.example.com/user/1";

    // Act
    await fetchData(url, callback);

    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("callback이 제공되지 않은 경우 callback 함수가 호출되지 않는지 확인", async () => {
    // Arrange
    const url = "https://api.example.com/user/1";

    // Act
    // callback 함수 전달 X
    await fetchData(url);

    // Assert
    // 0번 호출되었는지 확인
    expect(callback).toHaveBeenCalledTimes(0);
    // 또는 호출이 되지 않았는지 확인
    expect(callback).not.toHaveBeenCalled();
  });

  test("API 호출이 실패한 경우 테스트", () => {
    // Arrange
    expect.assertions(1); // 반드시 1개의 assertion이 호출되어야 함
    const url = "https://api.example.com/user/1";
    const errorMessage = "API 호출 실패";
    axios.get.mockRejectedValue(new Error(errorMessage));

    // Act & Assert (방법 1: catch 사용)
    return fetchData(url).catch((error) => {
      expect(error.message).toBe(errorMessage);
    });
  });

  // 방법 2: rejects 사용 - 더 간결하고 가독성이 좋음
  test("API 호출이 실패한 경우 테스트", () => {
    // Arrange
    const url = "https://api.example.com/user/1";
    const errorMessage = "API 호출 실패";
    axios.get.mockRejectedValue(new Error(errorMessage));

    // Act & Assert
    return expect(fetchData(url)).rejects.toThrow(errorMessage);
  });

  test("API 호출 콜백 테스트", (done) => {
    // 실제 API 호출을 시뮬레이션하는 함수
    // 0.5초 후에 콜백을 호출하는 함수
    const fetchUserData = (userId, callback) => {
      setTimeout(() => {
        if (userId === 1) {
          callback(null, { id: 1, name: "김철수", email: "kim@example.com" });
        } else {
          callback(new Error("사용자를 찾을 수 없습니다"), null);
        }
      }, 500);
    };

    // 성공 케이스 테스트
    fetchUserData(1, (error, user) => {
      expect(error).toBeNull();
      expect(user).toEqual({
        id: 1,
        name: "김철수",
        email: "kim@example.com",
      });
      done(); // 테스트 완료를 알림
    });
  });
});
