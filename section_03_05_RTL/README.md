# 2026-03-05 학습 내용 정리 (RTL)

## 목차

1. [find\*\*\* 쿼리](#1-find-쿼리)
   - [findBy\*\*\*란?](#findby란)
   - [findBy\*\*\* 쿼리 목록](#findby-쿼리-목록)
2. [userEvent vs fireEvent](#2-userevent-vs-fireevent)
   - [차이점 비교](#차이점-비교)
   - [setup()](#setup)
3. [renderHook](#3-renderhook)
4. [act](#4-act)
5. [waitFor](#5-waitfor)
6. [act vs waitFor 차이점](#6-act-vs-waitfor-차이점)
7. [커스텀 훅 테스트](#7-커스텀-훅-테스트)
8. [Zustand 테스트](#8-zustand-테스트)
   - [스토어 직접 테스트](#스토어-직접-테스트)
   - [\_\_mocks\_\_ 를 이용한 자동 격리](#__mocks__-를-이용한-자동-격리)

---

## 1. find\*\*\* 쿼리

### findBy\*\*\*란?

`findBy...` 계열 쿼리는 **비동기적으로 렌더링되는 요소**를 기다렸다가 찾는다.
내부적으로 `waitFor`를 사용하며, `Promise`를 반환하기 때문에 `await`와 함께 사용한다.

| 접두사      | 요소가 없을 때        | 비동기 대기  | 반환 타입         |
| ----------- | --------------------- | ------------ | ----------------- |
| `getBy...`  | 에러 throw            | ❌           | Element           |
| `queryBy..` | `null` 반환           | ❌           | Element \| null   |
| `findBy...` | 에러 throw (시간초과) | ✅ (Promise) | Promise\<Element> |

기본 타임아웃은 **1000ms**이며, `options`의 `timeout`으로 조정할 수 있다.
시간 내에 요소가 나타나지 않으면 에러를 throw한다.

```
// 쿼리 접두사 3종 요약
getBy   → 즉시 조회, 없으면 에러
queryBy → 즉시 조회, 없으면 null
findBy  → 비동기 대기 후 조회, 없으면 에러
```

### findBy\*\*\* 쿼리 목록

`findBy` 뒤에 붙는 기준은 `getBy` / `queryBy`와 동일하다. 모두 `await`와 함께 사용한다.

| 쿼리                    | 찾는 기준                                      | 주요 사용 상황                            |
| ----------------------- | ---------------------------------------------- | ----------------------------------------- |
| `findByText`            | 텍스트 콘텐츠                                  | 비동기 데이터가 화면에 표시될 때          |
| `findByRole`            | ARIA role (`button`, `heading`, `listitem` 등) | 역할 기반으로 비동기 요소를 찾을 때       |
| `findByLabelText`       | `<label>`과 연결된 폼 입력 요소                | 비동기로 렌더링된 폼 필드를 찾을 때       |
| `findByPlaceholderText` | `placeholder` 속성                             | 라벨 없이 placeholder로 찾을 때           |
| `findByDisplayValue`    | 현재 입력된 값 (input / select / textarea)     | 이미 값이 채워진 비동기 폼 요소를 찾을 때 |
| `findByAltText`         | `alt` 속성 (`<img>` 등)                        | 비동기로 로드된 이미지를 찾을 때          |
| `findByTitle`           | `title` 속성                                   | title 속성으로 요소를 찾을 때             |
| `findByTestId`          | `data-testid` 속성                             | 다른 쿼리로 찾기 어려운 최후의 수단       |

각 쿼리에는 여러 요소를 배열로 반환하는 **`findAllBy...` 버전**도 있다.

```
findByText      → 단일 요소 반환
findAllByText   → 배열 반환 (여러 요소)
```

---

## 2. userEvent vs fireEvent

### 차이점 비교

`fireEvent`는 단일 DOM 이벤트를 직접 발생시키는 **저수준 API**다.
`userEvent`는 실제 브라우저에서 사용자가 행동할 때 발생하는 **연속적인 이벤트들을 시뮬레이션**하는 **고수준 API**다.

```
fireEvent.click(button)
→ click 이벤트 1개만 발생

userEvent.click(button)
→ pointerover → pointerenter → mouseover → mouseenter → pointermove → mousemove
  → pointerdown → mousedown → pointerup → mouseup → click 순서로 발생
```

| 항목              | `fireEvent`                    | `userEvent`                        |
| ----------------- | ------------------------------ | ---------------------------------- |
| 제공 패키지       | `@testing-library/dom`         | `@testing-library/user-event`      |
| 동작 수준         | 낮음 (단일 이벤트)             | 높음 (실제 사용자 행동 시뮬레이션) |
| 비동기 여부       | 동기                           | 비동기 (`await` 필요)              |
| 타이핑 시뮬레이션 | `fireEvent.change`로 값만 설정 | 실제 키 입력을 한 글자씩 발생      |
| 권장 여부         | 단순한 이벤트 테스트           | **일반적으로 권장**                |

#### 예제 코드

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "./SearchInput";

test("검색어를 입력하면 onChange가 호출된다", async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();

  render(<SearchInput onChange={handleChange} />);

  const input = screen.getByRole("textbox");

  // 실제 타이핑처럼 한 글자씩 이벤트가 발생한다
  await user.type(input, "리액트");

  expect(input).toHaveValue("리액트");
  expect(handleChange).toHaveBeenCalledTimes(3); // 글자 수만큼 호출
});
```

---

### setup()

#### 개념

`userEvent.setup()`은 **테스트 환경을 초기화한 `userEvent` 인스턴스**를 반환한다.
각 테스트마다 독립적인 상태(포인터 위치, 클립보드 등)를 유지하기 위해 `setup()`으로 인스턴스를 생성하는 것이 권장된다.

v14 이전에는 `userEvent.click(element)`처럼 직접 호출하는 방식을 사용했지만,
**v14부터는 `userEvent.setup()`으로 인스턴스를 생성한 뒤 사용하는 것이 권장된다.**

#### 예제 코드

```tsx
import userEvent from "@testing-library/user-event";

// 권장: setup()으로 인스턴스 생성
test("버튼을 클릭한다", async () => {
  const user = userEvent.setup();
  render(<Button />);

  await user.click(screen.getByRole("button"));
});
```

`setup()`의 옵션으로 딜레이, 포인터 기기 종류, 클립보드 동작 등을 설정할 수 있다.

```tsx
// 타이핑 딜레이 제거 (테스트 속도 향상)
const user = userEvent.setup({ delay: null });
```

주요 `userEvent` 메서드:

| 메서드                  | 동작                                    |
| ----------------------- | --------------------------------------- |
| `user.click(element)`   | 클릭 (포인터 이벤트 포함)               |
| `user.type(el, text)`   | 텍스트 타이핑 (한 글자씩 키보드 이벤트) |
| `user.clear(element)`   | 입력 필드 내용 지우기                   |
| `user.tab()`            | Tab 키 입력 (포커스 이동)               |
| `user.keyboard(text)`   | 특수 키 포함 키보드 입력 (`{Enter}` 등) |
| `user.selectOptions()`  | `<select>` 옵션 선택                    |
| `user.hover(element)`   | 마우스 올리기                           |
| `user.unhover(element)` | 마우스 내리기                           |

---

## 3. renderHook

#### 개념

`renderHook`은 **React 컴포넌트 없이 커스텀 훅만 독립적으로 렌더링**해서 테스트하는 유틸리티다.
`@testing-library/react`에서 제공한다.

훅을 테스트하기 위해 더미 컴포넌트를 만들 필요 없이, 훅의 반환값과 동작을 직접 검증할 수 있다.

#### 기본 구조

```tsx
import { renderHook } from "@testing-library/react";

const { result, rerender, unmount } = renderHook(() => useMyHook(initialArg));
```

| 반환값     | 설명                                               |
| ---------- | -------------------------------------------------- |
| `result`   | 훅의 반환값. `result.current`로 현재 값에 접근한다 |
| `rerender` | 훅을 새 인수로 다시 렌더링한다                     |
| `unmount`  | 훅을 언마운트한다 (cleanup 검증 등에 사용)         |

#### 예제 코드

```tsx
import { renderHook, act } from "@testing-library/react";
import useCounter from "./useCounter";

test("초기값이 0이다", () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);
});

test("increment를 호출하면 카운트가 1 증가한다", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

> `result.current`는 훅의 **현재 반환값**을 담는다. 상태가 업데이트된 뒤에는 자동으로 최신 값을 반영한다.

---

## 4. act

#### 개념

`act`는 **React 상태 업데이트와 리렌더링이 완료될 때까지 기다리는** 래퍼 함수다.
`@testing-library/react`에서 import해서 사용한다.

React는 상태 업데이트를 배치(batch)로 처리하기 때문에, `act` 없이 상태를 변경하면
DOM이 업데이트되기 전에 assertion이 실행되어 테스트가 잘못된 결과를 낼 수 있다.

```
act 없이 setState 호출
  → React가 아직 DOM을 업데이트하지 않음
  → assertion이 이전 상태로 검증됨 → 잘못된 결과

act로 감싸서 setState 호출
  → act 블록이 끝날 때 React가 모든 업데이트를 즉시 플러시
  → assertion이 최신 DOM으로 검증됨
```

#### 예제 코드

**동기 상태 업데이트**

```tsx
import { renderHook, act } from "@testing-library/react";
import useToggle from "./useToggle";

test("toggle을 호출하면 값이 반전된다", () => {
  const { result } = renderHook(() => useToggle(false));

  expect(result.current.value).toBe(false);

  act(() => {
    result.current.toggle();
  });

  expect(result.current.value).toBe(true);
});
```

**비동기 상태 업데이트**

```tsx
act(async () => {
  await someAsyncStateUpdate();
});
```

> RTL의 `fireEvent`, `userEvent`, `findBy...` 등은 내부적으로 `act`를 자동으로 감싸기 때문에 직접 사용할 일이 줄었다. `renderHook`과 함께 훅의 메서드를 직접 호출할 때 주로 필요하다.

---

## 5. waitFor

#### 개념

`waitFor`는 **assertion이 통과할 때까지 반복적으로 재시도**하는 비동기 유틸리티다.
DOM이 언제 업데이트될지 정확히 알 수 없는 경우(API 호출, 타이머 등)에 사용한다.

기본적으로 50ms 간격으로 콜백을 재실행하며, 기본 타임아웃은 1000ms다.

```tsx
import { waitFor } from "@testing-library/react";

await waitFor(() => {
  expect(screen.getByText("데이터 로드 완료")).toBeInTheDocument();
});
```

#### 예제 코드

**API 응답 후 DOM 변화 검증**

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

test("로그인 성공 후 환영 메시지가 표시된다", async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText("이메일"), "test@example.com");
  await user.type(screen.getByLabelText("비밀번호"), "password123");
  await user.click(screen.getByRole("button", { name: "로그인" }));

  await waitFor(() => {
    expect(screen.getByText("환영합니다!")).toBeInTheDocument();
  });
});
```

**타임아웃 / 폴링 간격 옵션**

```tsx
await waitFor(
  () => {
    expect(screen.getByText("완료")).toBeInTheDocument();
  },
  {
    timeout: 3000, // 최대 3초 대기 (기본 1000ms)
    interval: 100, // 100ms마다 재시도 (기본 50ms)
  },
);
```

> `waitFor` 콜백 안에서는 **assertion만** 작성한다. 이벤트 발생이나 상태 변경 같은 부수효과(side effect)는 `waitFor` 밖에서 수행해야 한다.

---

## 6. act vs waitFor 차이점

`act`와 `waitFor`는 모두 비동기 상태 업데이트를 다루지만 목적과 동작 방식이 다르다.

| 항목        | `act`                             | `waitFor`                                 |
| ----------- | --------------------------------- | ----------------------------------------- |
| 목적        | React 상태 업데이트를 즉시 플러시 | assertion이 통과할 때까지 반복 대기       |
| 동작 방식   | 콜백 내 업데이트를 한 번에 처리   | 콜백(assertion)을 타임아웃까지 반복 실행  |
| 사용 시점   | 상태 변경 코드를 직접 감쌀 때     | 언제 DOM이 업데이트될지 모를 때           |
| 주요 사용처 | `renderHook`의 훅 메서드 호출     | API 응답, 타이머, 애니메이션 종료 후 검증 |
| 반환값      | void (또는 Promise)               | Promise                                   |

```tsx
// act: 상태 변경 코드를 감싼다
act(() => {
  result.current.increment(); // 훅 메서드 호출 → 상태 업데이트 플러시
});
expect(result.current.count).toBe(1); // act 이후에 바로 검증

// waitFor: assertion이 통과할 때까지 기다린다
await waitFor(() => {
  expect(screen.getByText("로드 완료")).toBeInTheDocument(); // 통과할 때까지 반복
});
```

**언제 무엇을 쓸까?**

- 훅의 메서드를 직접 호출해 상태를 변경할 때 → `act`
- API 요청, 타이머 등으로 인해 DOM이 나중에 바뀔 때 → `waitFor` 또는 `findBy...`
- `findBy...`는 내부적으로 `waitFor`를 사용하므로 단순 조회는 `findBy...`가 더 간결하다

---

## 7. 커스텀 훅 테스트

#### 개념

커스텀 훅을 테스트할 때는 `renderHook`으로 훅을 독립적으로 렌더링하고,
상태 변경은 `act`로 감싸서 React 업데이트를 즉시 적용한다.

Context나 외부 Provider가 필요한 훅은 `renderHook`의 `wrapper` 옵션으로 Provider를 감싸서 제공한다.

#### 예제 코드

**기본 커스텀 훅 테스트**

```tsx
import { renderHook, act } from "@testing-library/react";
import useCounter from "./useCounter";

// useCounter: { count, increment, decrement, reset } 반환
describe("useCounter", () => {
  test("초기값이 주어진 값으로 설정된다", () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);
  });

  test("increment를 호출하면 카운트가 1 증가한다", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  test("reset을 호출하면 초기값으로 돌아간다", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(7);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });
});
```

**Context가 필요한 훅 테스트**

```tsx
import { renderHook } from "@testing-library/react";
import { ThemeProvider } from "./ThemeContext";
import useTheme from "./useTheme";

test("ThemeContext에서 현재 테마를 가져온다", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
  );

  const { result } = renderHook(() => useTheme(), { wrapper });

  expect(result.current.theme).toBe("dark");
});
```

**비동기 훅 테스트**

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import useFetchUser from "./useFetchUser";

test("사용자 데이터를 불러온다", async () => {
  const { result } = renderHook(() => useFetchUser("1"));

  // 초기 로딩 상태 확인
  expect(result.current.isLoading).toBe(true);

  // 데이터 로드 완료까지 대기
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.data).toEqual({ id: "1", name: "홍길동" });
});
```

---

## 8. Zustand 테스트

Zustand 스토어를 테스트할 때는 **각 테스트 간 스토어 상태가 격리**되어야 한다.
스토어 상태가 테스트 간에 공유되면 실행 순서에 따라 결과가 달라지는 flaky 테스트가 생긴다.

---

### 스토어 직접 테스트

#### 개념

각 테스트 전 `beforeEach`에서 `useStore.setState(initialState, true)`를 호출해 스토어를 초기 상태로 되돌린다.
두 번째 인수 `true`는 기존 상태를 **완전히 교체(replace)** 하는 옵션이다.

#### 예제 코드

**스토어 직접 테스트 (상태 로직 검증)**

```tsx
import { act, renderHook } from "@testing-library/react";
import { useCounterStore } from "./counterStore";

// 각 테스트 전 스토어 상태 리셋
beforeEach(() => {
  useCounterStore.setState({ count: 0 });
});

describe("useCounterStore", () => {
  test("초기 count가 0이다", () => {
    const { result } = renderHook(() => useCounterStore());

    expect(result.current.count).toBe(0);
  });

  test("increment를 호출하면 count가 1 증가한다", () => {
    const { result } = renderHook(() => useCounterStore());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

**스토어를 사용하는 컴포넌트 테스트**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCounterStore } from "./counterStore";
import Counter from "./Counter";

beforeEach(() => {
  useCounterStore.setState({ count: 0 });
});

test("증가 버튼을 클릭하면 화면의 숫자가 증가한다", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  expect(screen.getByText("0")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "증가" }));

  expect(screen.getByText("1")).toBeInTheDocument();
});
```

**스토어 모킹 (외부 의존성 격리)**

```tsx
import { useCounterStore } from "./counterStore";

// 스토어 전체를 모킹
jest.mock("./counterStore");

const mockIncrement = jest.fn();

beforeEach(() => {
  (useCounterStore as jest.Mock).mockReturnValue({
    count: 5,
    increment: mockIncrement,
  });
});

test("현재 count 값을 렌더링한다", () => {
  render(<Counter />);

  expect(screen.getByText("5")).toBeInTheDocument();
});

test("증가 버튼 클릭 시 increment가 호출된다", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "증가" }));

  expect(mockIncrement).toHaveBeenCalledTimes(1);
});
```

> Zustand의 `setState`는 테스트 환경에서도 동일하게 동작한다. `beforeEach`에서 `useStore.setState(initialState)`를 호출하면 손쉽게 스토어를 초기 상태로 되돌릴 수 있다.

---

### \_\_mocks\_\_ 를 이용한 자동 격리

#### 개념

앱에 Zustand 스토어가 여러 개일 때, 각 테스트 파일마다 `beforeEach`로 스토어를 일일이 리셋하는 것은 번거롭다.
Zustand 공식 문서에서는 `__mocks__/zustand.ts` 파일을 만들어 **모든 스토어를 자동으로 격리**하는 방법을 권장한다.

#### 동작 원리

```
1. Jest가 테스트에서 'zustand'를 import할 때, 실제 모듈 대신 __mocks__/zustand.ts를 로드한다
2. 모킹된 create / createStore는 스토어 생성 시 초기 상태를 캡처한다
3. afterEach에서 storeResetFns의 모든 리셋 함수를 실행해 전체 스토어를 초기화한다
```

#### 설정 방법

프로젝트 루트(또는 `src/`)에 `__mocks__` 폴더를 만들고 `zustand.ts`를 추가한다.

```
project/
├── __mocks__/
│   └── zustand.ts   ← 이 파일이 Jest에서 zustand를 자동으로 대체한다
├── src/
│   └── store/
│       └── counterStore.ts
└── jest.config.ts
```

#### \_\_mocks\_\_/zustand.ts

```ts
// __mocks__/zustand.ts
import { act } from "@testing-library/react";
import type * as ZustandExportedTypes from "zustand";
export * from "zustand"; // 원본 타입·유틸 함수는 그대로 re-export

const { create: actualCreate, createStore: actualCreateStore } =
  jest.requireActual<typeof ZustandExportedTypes>("zustand");

// 앱에서 생성된 모든 스토어의 리셋 함수를 보관하는 Set
export const storeResetFns = new Set<() => void>();

// create의 커리 버전을 처리하는 내부 함수
const createUncurried = <T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getInitialState(); // 초기 상태 캡처
  storeResetFns.add(() => {
    store.setState(initialState, true); // true: 상태 완전 교체
  });
  return store;
};

// 모킹된 create: 스토어 생성 시 리셋 함수를 자동 등록
export const create = (<T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  return typeof stateCreator === "function" ? createUncurried(stateCreator) : createUncurried; // 커리 버전 지원
}) as typeof ZustandExportedTypes.create;

// createStore도 동일하게 처리
const createStoreUncurried = <T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  const store = actualCreateStore(stateCreator);
  const initialState = store.getInitialState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

export const createStore = (<T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  return typeof stateCreator === "function"
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried;
}) as typeof ZustandExportedTypes.createStore;

// 모든 테스트가 끝날 때마다 전체 스토어를 초기 상태로 되돌린다
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => resetFn());
  });
});
```

#### 사용법

`__mocks__/zustand.ts`를 만들어두면 **테스트 파일에서 별도 설정 없이** 스토어가 자동 격리된다.
각 테스트가 끝날 때마다 `afterEach`가 자동으로 모든 스토어를 초기 상태로 리셋한다.

```tsx
// counterStore.ts — 실제 스토어 (변경 없음)
import { create } from "zustand";

interface CounterState {
  count: number;
  increment: () => void;
}

export const useCounterStore = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));
```

```tsx
// Counter.test.tsx — beforeEach 리셋 없이 테스트 격리가 자동으로 된다
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";

// __mocks__/zustand.ts가 있으면 afterEach에서 자동 리셋되므로
// beforeEach에서 수동으로 setState할 필요가 없다

test("초기 카운트가 0이다", () => {
  render(<Counter />);
  expect(screen.getByText("0")).toBeInTheDocument();
});

test("증가 버튼을 클릭하면 카운트가 1이 된다", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "증가" }));

  expect(screen.getByText("1")).toBeInTheDocument();
});

// 이전 테스트에서 증가했어도 자동 리셋되므로 0부터 시작한다
test("두 번 클릭하면 카운트가 2가 된다", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "증가" }));
  await user.click(screen.getByRole("button", { name: "증가" }));

  expect(screen.getByText("2")).toBeInTheDocument();
});
```

#### beforeEach 수동 리셋 vs \_\_mocks\_\_ 자동 리셋 비교

| 항목           | `beforeEach` 수동 리셋               | `__mocks__/zustand.ts` 자동 리셋        |
| -------------- | ------------------------------------ | --------------------------------------- |
| 설정 위치      | 각 테스트 파일                       | 프로젝트 전역 (`__mocks__/zustand.ts`)  |
| 스토어 추가 시 | 새 스토어마다 `beforeEach` 추가 필요 | 자동으로 `storeResetFns`에 등록         |
| 실수 가능성    | 리셋 누락 시 테스트 간 오염 발생     | 누락 없음                               |
| 적합한 상황    | 스토어가 1~2개, 간단한 프로젝트      | 스토어가 많거나 여러 파일에서 사용할 때 |

> `__mocks__` 폴더는 Jest가 자동으로 인식한다. `jest.config.ts`에서 `moduleNameMapper`를 설정하지 않아도 `node_modules` 옆에 `__mocks__` 폴더를 두면 해당 패키지를 자동으로 대체한다.
