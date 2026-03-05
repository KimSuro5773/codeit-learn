// src/components/Input/index.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import { Input } from ".";

test("Input 컴포넌트 미입력 시 X 버튼이 보이지 않아야 한다.", () => {
  render(<Input onChange={jest.fn()} onDelete={jest.fn()} />);

  const input = screen.getByRole("textbox");
  const deleteButton = screen.queryByRole("button", { name: "입력값 지우기" });

  // 입력값이 없고,
  expect(input).toHaveValue("");
  // X 버튼이 보이지 않아야 한다.
  expect(deleteButton).not.toBeInTheDocument();
});

test("Input 컴포넌트에 입력값이 있을 때 X 버튼이 보이는지 확인한다.", () => {
  render(<Input value="입력값" onChange={jest.fn()} onDelete={jest.fn()} />);

  const input = screen.getByRole("textbox");
  const deleteButton = screen.getByRole("button", { name: "입력값 지우기" });

  // 입력값이 있고,
  expect(input).toHaveValue("입력값");
  // X 버튼이 보인다.
  expect(deleteButton).toBeInTheDocument();
});

// test("X 버튼 클릭 시 입력값이 지워지는지 확인한다", () => {
//   render(<Input value="입력값" onChange={jest.fn()} onDelete={jest.fn()} />);

//   const input = screen.getByRole("textbox");
//   const deleteButton = screen.getByRole("button", { name: "입력값 지우기" });

//   // X 버튼 클릭
//   fireEvent.click(deleteButton);

//   // 입력값이 지워지고,
//   expect(input).toHaveValue("");
//   // X 버튼이 사라진다.
//   expect(deleteButton).not.toBeInTheDocument();
// });

test("X 버튼 클릭 시 onDelete props에 전달된 함수가 호출되는지 확인한다.", () => {
  const onDelete = jest.fn();
  render(<Input value="입력값" onChange={jest.fn()} onDelete={onDelete} />);

  const deleteButton = screen.getByRole("button", { name: "입력값 지우기" });

  // X 버튼 클릭
  fireEvent.click(deleteButton);

  // onDelete 함수가 호출된다.
  expect(onDelete).toHaveBeenCalled();
});

test("Input 컴포넌트 에러 발생 시 에러 메세지가 보이는지 확인한다", () => {
  render(
    <Input
      isError={true}
      errorMessage="입력값에 문제가 있습니다"
      onChange={jest.fn()}
      onDelete={jest.fn()}
    />,
  );

  const errorMessage = screen.getByText("입력값에 문제가 있습니다");

  // 에러 메세지가 보인다.
  expect(errorMessage).toBeInTheDocument();
});
