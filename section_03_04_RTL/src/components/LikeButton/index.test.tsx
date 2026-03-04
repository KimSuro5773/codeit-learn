import { fireEvent, render, screen } from "@testing-library/react";
import { LikeButton } from ".";

describe("LikeButton 컴포넌트 테스트", () => {
  beforeEach(() => {
    render(<LikeButton />);
  });

  test("좋아요 버튼을 누르기 전에 버튼에 좋아요라는 텍스트가 표시되며 bg-gray-400 스타일이 적용된다.", () => {
    const likeButton = screen.getByRole("button", { name: "좋아요" });

    expect(likeButton).toBeInTheDocument();
    expect(likeButton).toHaveClass("bg-gray-400");
  });

  test("좋아요 버튼을 클릭하면 좋아요 취소로 텍스트가 변경되고 bg-red-400 클래스가 적용된다.", () => {
    const likeButton = screen.getByRole("button", { name: "좋아요" });

    fireEvent.click(likeButton);

    expect(likeButton).toHaveTextContent("좋아요");
    expect(likeButton).toHaveClass("bg-red-400");
  });

  test("좋아요 버튼을 한 번 클릭 후 다시 클릭하면 좋아요 버튼으로 되돌아온다.", () => {
    const likeButton = screen.getByRole("button", { name: "좋아요" });

    fireEvent.click(likeButton);
    expect(likeButton).toHaveTextContent("좋아요 취소");

    fireEvent.click(likeButton);
    expect(likeButton).toHaveTextContent("좋아요");
  });
});
