// src/components/Button/index.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from ".";
import { userEvent } from "@testing-library/user-event";

test("버튼을 클릭하면 onClick 함수가 호출되는지 확인", async () => {
  const user = userEvent.setup();
  // onClick props에 들어갈 함수를 모킹한다.
  const handleClick = jest.fn();
  // 모킹한 함수를 onClick props에 전달하여 버튼 렌더링
  render(<Button onClick={handleClick}>버튼내용</Button>);

  // 버튼을 클릭
  const button = screen.getByText("버튼내용");
  await user.click(button);

  // 버튼 클릭 시 모킹한 함수가 1번 호출되었는지 확인
  expect(handleClick).toHaveBeenCalledTimes(1);
});
