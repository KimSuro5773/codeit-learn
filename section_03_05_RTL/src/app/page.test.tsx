import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home Page 테스트", () => {
  test("첫 렌더링 시 초기값이 0인지 확인", () => {
    render(<Home />);

    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  test("증가 버튼 클릭 시 카운트가 증가해야 한다.", () => {
    render(<Home />);
    const incrementButton = screen.getByText("증가");
    fireEvent.click(incrementButton);
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });

  test("감소 버튼 클릭 시 카운트가 감소해야 한다.", () => {
    render(<Home />);
    const decrementButton = screen.getByText("감소");
    fireEvent.click(decrementButton);
    expect(screen.getByText("Count: -1")).toBeInTheDocument();
  });
});
