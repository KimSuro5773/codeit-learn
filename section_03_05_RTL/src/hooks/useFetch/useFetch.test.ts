import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "./useFetch";

describe("useFetch 테스트", () => {
  test("데이터를 성공적으로 가져오면 data state에 잘 담기는지 확인", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        name: "김수로",
        age: "26",
      }),
    });

    const { result } = renderHook(() => useFetch("https://api.example.com/data"));

    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual({ name: "김수로", age: "26" });
      expect(result.current.error).toBeNull();
      expect(globalThis.fetch).toHaveBeenCalledWith("https://api.example.com/data");
    });
  });

  test("서버 에러 처리가 정상적으로 작동하는지 테스트", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    const { result } = renderHook(() => useFetch("https://api.example.com/data"));

    // 로딩이 끝날 때 까지 기다리기
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("서버 응답이 정상적이지 않습니다");
  });

  test("네트워크 에러 시 error 상태가 업데이트 되는지 확인", async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error("failed to fetch"));

    const { result } = renderHook(() => useFetch("https://api.example.com/data"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("failed to fetch");
  });
});
