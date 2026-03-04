# 2026-03-04 학습 내용 정리 (RTL)

## 목차

1. [RTL (React Testing Library)](#1-rtl-react-testing-library)
   - [RTL이란?](#rtl이란)
   - [Jest & RTL 설치](#jest--rtl-설치)
2. [렌더링 & 화면 조회](#2-렌더링--화면-조회)
   - [render](#render)
   - [screen](#screen)
3. [쿼리 함수](#3-쿼리-함수)
   - [쿼리 권장 우선순위 (Priority)](#쿼리-권장-우선순위-priority)
   - [getByText](#getbytext)
   - [getByRole](#getbyrole)
   - [getByLabelText](#getbylabeltext)
   - [getByPlaceholderText](#getbyplaceholdertext)
   - [getByTestId](#getbytestid)
   - [queryByRole](#querybyrole)
4. [DOM 매처](#4-dom-매처)
   - [toBeInTheDocument](#tobeintheDocument)
   - [toHaveTextContent](#tohavetextcontent)
   - [toHaveClass](#tohaveclass)
   - [toBeDisabled](#tobedisabled)
   - [toBeChecked](#tobechecked)
5. [이벤트 발생](#5-이벤트-발생)
   - [fireEvent](#fireevent)
   - [fireEvent.click](#fireeventclick)
   - [그 외 fireEvent](#그-외-fireevent)

---

## 1. RTL (React Testing Library)

### RTL이란?

RTL(React Testing Library)은 **React 컴포넌트를 사용자 관점에서 테스트**하기 위한 라이브러리다.
DOM Testing Library를 기반으로 하며, 컴포넌트의 내부 구현보다 **실제 사용자가 보고 상호작용하는 방식**에 집중한다.

Jest가 테스트 실행 환경과 assertion을 담당한다면, RTL은 **React 컴포넌트를 렌더링하고 DOM을 조회·조작하는 도구**를 제공한다.

```
Jest  → 테스트 러너, 매처(toBe, toEqual 등), 모킹 기능 제공
RTL   → 컴포넌트 렌더링(render), DOM 쿼리(getBy...), 이벤트 발생(fireEvent, userEvent) 제공
```

RTL의 핵심 철학:

> "테스트는 소프트웨어가 사용되는 방식과 유사할수록 더 많은 신뢰를 준다."

- 내부 구현(state, props)이 아닌 **실제 DOM 출력**을 기준으로 검증한다
- 사용자가 볼 수 없는 세부 구현이 바뀌어도 테스트가 깨지지 않는다

---

### Jest & RTL 설치

#### 설치 명령어

```bash
npm install -D jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node
npm init jest@latest
```

| 패키지                      | 역할                                                                    |
| --------------------------- | ----------------------------------------------------------------------- |
| `jest`                      | 테스트 러너 본체                                                        |
| `@types/jest`               | Jest의 TypeScript 타입 정의                                             |
| `jest-environment-jsdom`    | Node.js 환경에서 브라우저 DOM을 시뮬레이션하는 환경                     |
| `@testing-library/react`    | React 컴포넌트를 렌더링하고 DOM을 조회하는 RTL 핵심 패키지              |
| `@testing-library/dom`      | RTL의 기반이 되는 DOM 조회 유틸리티                                     |
| `@testing-library/jest-dom` | `toBeInTheDocument`, `toHaveTextContent` 등 DOM 전용 매처 확장          |
| `ts-node`                   | Jest 설정 파일(`jest.config.ts`)을 TypeScript로 작성할 때 필요한 실행기 |

#### Jest 초기 설정

`npm init jest@latest`를 실행하면 대화형 CLI로 `jest.config.ts`(또는 `.js`)를 생성할 수 있다.
React + TypeScript 프로젝트에서는 아래 항목을 선택한다.

- **Test environment**: `jsdom` → 브라우저 DOM API를 사용할 수 있도록 설정
- **Transform**: Babel 또는 `ts-jest` → TypeScript / JSX를 변환

#### jest.setup.ts

`@testing-library/jest-dom`의 커스텀 매처(`toBeInTheDocument` 등)를 전역으로 등록하려면 설정 파일을 만든다.

```ts
// jest.setup.ts
import "@testing-library/jest-dom";
```

`jest.config.ts`에서 이 파일을 `setupFilesAfterEnv`에 등록한다.

```ts
// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.ts"],
};

export default config;
```

> `setupFilesAfterEnv`에 등록된 파일은 **각 테스트 파일 실행 직전**에 자동으로 import된다. 덕분에 모든 테스트 파일에서 `@testing-library/jest-dom`의 매처를 별도 import 없이 바로 사용할 수 있다.

---

## 2. 렌더링 & 화면 조회

### render

#### 개념

`render(component)`는 React 컴포넌트를 **가상 DOM(jsdom)에 마운트**한다.
실제 브라우저 없이 컴포넌트를 렌더링해서 DOM 조회와 이벤트 발생을 가능하게 한다.

반환값으로 `container`, `unmount` 등 여러 유틸리티를 제공하지만, 대부분의 경우 반환값 대신 `screen`을 통해 DOM을 조회한다.

#### 예제 코드

```tsx
import { render } from "@testing-library/react";
import Button from "./Button";

test("버튼이 렌더링된다", () => {
  render(<Button label="확인" />);
  // 이후 screen으로 DOM 조회
});
```

props나 context가 필요한 컴포넌트는 두 번째 인수 `options`로 wrapper를 제공할 수 있다.

```tsx
import { render } from "@testing-library/react";
import { ThemeProvider } from "./ThemeProvider";
import ThemedButton from "./ThemedButton";

test("테마가 적용된 버튼이 렌더링된다", () => {
  render(<ThemedButton />, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
  });
});
```

---

### screen

#### 개념

`screen`은 `render`로 마운트된 DOM 전체를 대상으로 쿼리 함수를 실행하는 **전역 조회 객체**다.
`render`의 반환값에서 쿼리를 꺼내는 구버전 방식 대신, **`screen`을 통한 조회가 현재 권장 방식**이다.

```
// ❌ 구버전: render 반환값에서 꺼내는 방식
const { getByText } = render(<Component />);

// ✅ 권장: screen으로 조회하는 방식
render(<Component />);
screen.getByText("확인");
```

#### 예제 코드

```tsx
import { render, screen } from "@testing-library/react";
import Greeting from "./Greeting";

test("인사말이 표시된다", () => {
  render(<Greeting name="홍길동" />);

  const heading = screen.getByText("안녕하세요, 홍길동!");
  expect(heading).toBeInTheDocument();
});
```

> `screen`은 항상 현재 렌더링된 DOM 전체를 기준으로 동작한다. 여러 컴포넌트를 순서대로 `render`해도 `screen`은 가장 최근에 렌더링된 상태를 반영한다.

---

## 3. 쿼리 함수

RTL의 쿼리 함수는 DOM에서 특정 요소를 찾아 반환한다.
찾는 방법(By 뒤의 기준)과 찾지 못했을 때의 동작(앞의 접두사)으로 구분된다.

| 접두사      | 요소가 없을 때        | 요소가 여러 개일 때 | 비동기 대기  |
| ----------- | --------------------- | ------------------- | ------------ |
| `getBy...`  | 에러 throw            | 에러 throw          | ❌           |
| `queryBy..` | `null` 반환           | 에러 throw          | ❌           |
| `findBy...` | 에러 throw (시간초과) | 에러 throw          | ✅ (Promise) |

### 쿼리 권장 우선순위 (Priority)

RTL 공식 문서는 쿼리 함수를 아래 순서대로 우선 사용하길 권장한다.
접근성 트리 기반 쿼리일수록 실제 사용자 경험에 가깝고, `getByTestId`는 최후의 수단이다.

#### 1순위 — 모든 사용자가 접근 가능한 쿼리

시각/마우스 사용자와 스크린리더 등 보조기술 사용자 모두에게 의미 있는 기준으로 찾는다.

| 쿼리                   | 설명                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `getByRole`            | 접근성 트리에 노출된 요소를 role로 찾는다. `name` 옵션으로 필터링 가능. **가장 우선 권장** |
| `getByLabelText`       | `<label>`과 연결된 폼 입력 요소를 찾는다. 사용자가 레이블로 폼을 탐색하는 방식과 동일      |
| `getByPlaceholderText` | `placeholder` 속성으로 찾는다. 라벨이 없을 때만 사용 (플레이스홀더는 레이블 대체물이 아님) |
| `getByText`            | 텍스트 콘텐츠로 찾는다. 폼 외부의 비대화형 요소(div, span, p 등)에 적합                    |
| `getByDisplayValue`    | 현재 입력된 값으로 폼 요소를 찾는다. 이미 값이 채워진 input/select/textarea에 유용         |

#### 2순위 — 시맨틱 쿼리

HTML5 / ARIA 속성 기반으로 찾는다. 보조기술마다 해석이 다를 수 있다.

| 쿼리           | 설명                                                                  |
| -------------- | --------------------------------------------------------------------- |
| `getByAltText` | `alt` 속성으로 찾는다. `<img>`, `<area>`, `<input>` 등에 사용         |
| `getByTitle`   | `title` 속성으로 찾는다. 스크린리더가 일관성 있게 읽지 않아 덜 권장됨 |

#### 3순위 — Test ID

| 쿼리          | 설명                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------- |
| `getByTestId` | `data-testid` 속성으로 찾는다. 사용자에게 보이지 않으므로 다른 쿼리로 찾기 어려울 때만 사용 |

---

### getByText

#### 개념

`screen.getByText(text)`는 DOM에서 **텍스트 내용이 일치하는 요소**를 찾는다.
문자열(완전 일치) 또는 정규식(부분 일치)을 전달할 수 있다.

#### 예제 코드

```tsx
import { render, screen } from "@testing-library/react";

test("제출 버튼이 표시된다", () => {
  render(<button>제출</button>);

  // 문자열: 완전 일치
  expect(screen.getByText("제출")).toBeInTheDocument();

  // 정규식: 부분 일치 (대소문자 무시)
  expect(screen.getByText(/제출/i)).toBeInTheDocument();
});
```

> 여러 요소가 같은 텍스트를 가지면 에러가 발생한다. 이 경우 `getAllByText`를 사용하거나 더 구체적인 쿼리로 교체한다.

---

### getByRole

#### 개념

`screen.getByRole(role, options?)`는 **ARIA role을 기준**으로 요소를 찾는다.
HTML 요소는 암묵적인 role을 가진다(`button` → `"button"`, `input[type=checkbox]` → `"checkbox"` 등).

접근성 트리를 기반으로 동작하기 때문에 **RTL에서 가장 권장하는 쿼리**다.

| HTML 요소                 | 암묵적 role |
| ------------------------- | ----------- |
| `<button>`                | `button`    |
| `<a href="...">`          | `link`      |
| `<input type="checkbox">` | `checkbox`  |
| `<input type="text">`     | `textbox`   |
| `<h1>` ~ `<h6>`           | `heading`   |
| `<img>`                   | `img`       |
| `<ul>`, `<ol>`            | `list`      |
| `<li>`                    | `listitem`  |

#### 예제 코드

```tsx
import { render, screen } from "@testing-library/react";
import LoginForm from "./LoginForm";

test("로그인 버튼이 표시된다", () => {
  render(<LoginForm />);

  // role만으로 조회
  const button = screen.getByRole("button");
  expect(button).toBeInTheDocument();
});

test("제목과 버튼을 각각 조회한다", () => {
  render(
    <div>
      <h1>회원가입</h1>
      <button>제출</button>
      <button>취소</button>
    </div>,
  );

  // name 옵션으로 텍스트까지 함께 지정해 특정 요소를 찾는다
  expect(screen.getByRole("heading", { name: "회원가입" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "제출" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
});
```

> 버튼이 여러 개일 때 `getByRole("button")`만 쓰면 에러가 발생한다. `{ name: "버튼 텍스트" }` 옵션으로 특정 버튼을 지정한다.

---

### getByLabelText

#### 개념

`screen.getByLabelText(text)`는 `<label>`과 연결된 **폼 입력 요소**를 찾는다.
`for` 속성(htmlFor)이나 `aria-label`, `aria-labelledby`로 연결된 요소를 모두 지원한다.

#### 예제 코드

```tsx
import { render, screen } from "@testing-library/react";

test("이메일 입력 필드를 찾는다", () => {
  render(
    <form>
      <label htmlFor="email">이메일</label>
      <input id="email" type="email" />
    </form>,
  );

  // label 텍스트로 연결된 input을 직접 찾는다
  const emailInput = screen.getByLabelText("이메일");
  expect(emailInput).toBeInTheDocument();
});
```

> `getByLabelText`를 사용하려면 `<label>`이 `<input>`과 올바르게 연결되어 있어야 한다. 연결이 없으면 요소를 찾지 못한다. 덕분에 **접근성이 올바르게 구현됐는지까지 함께 검증**하는 효과가 있다.

---

### getByPlaceholderText

#### 개념

`screen.getByPlaceholderText(text)`는 `placeholder` 속성 값으로 입력 요소를 찾는다.
`<label>`이 없는 입력 필드를 찾을 때 사용하지만, 접근성을 위해 가능하면 `getByLabelText`를 우선한다.

#### 예제 코드

```tsx
import { render, screen } from "@testing-library/react";

test("검색창을 placeholder로 찾는다", () => {
  render(<input type="text" placeholder="검색어를 입력하세요" />);

  const searchInput = screen.getByPlaceholderText("검색어를 입력하세요");
  expect(searchInput).toBeInTheDocument();
});
```

---

### getByTestId

#### 개념

`screen.getByTestId(testId)`는 `data-testid` 속성 값으로 요소를 찾는다.
접근성 기반 쿼리로 찾기 어려운 요소에 **최후의 수단**으로 사용한다.

```tsx
// 컴포넌트에 data-testid 추가
<div data-testid="loading-spinner">...</div>
```

#### 예제 코드

```tsx
import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";

test("로딩 중 스피너가 표시된다", () => {
  render(<Spinner />);

  // 접근성 기준으로 식별하기 어려운 순수 시각 요소를 찾을 때 사용
  expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
});
```

> `data-testid`는 테스트 전용 속성이라 실제 사용자에게 의미가 없다. `getByRole`이나 `getByLabelText`로 찾을 수 없을 때만 사용한다.

---

### queryByRole

#### 개념

`screen.queryByRole(role, options?)`는 `getByRole`과 동일하게 role로 요소를 찾지만,
**요소가 없을 때 에러 대신 `null`을 반환**한다.

`getBy...` 계열은 요소가 없으면 즉시 에러를 throw하기 때문에 **"요소가 존재하지 않음"을 검증할 때**는 `queryBy...`를 사용한다.

#### 예제 코드

```tsx
import { render, screen } from "@testing-library/react";
import Modal from "./Modal";

test("모달이 닫혀 있을 때 내용이 없다", () => {
  render(<Modal isOpen={false} />);

  // getByRole을 쓰면 요소가 없을 때 에러가 발생해 테스트가 실패한다
  // queryByRole은 null을 반환하므로 not.toBeInTheDocument()로 검증 가능하다
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("모달이 열려 있을 때 내용이 표시된다", () => {
  render(<Modal isOpen={true} content="안녕하세요" />);

  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
```

> **요소가 있어야 하면 `getBy...`**, **요소가 없음을 검증하려면 `queryBy...`** 를 사용한다.

---

## 4. DOM 매처

`@testing-library/jest-dom`이 제공하는 DOM 전용 커스텀 매처들이다.
`jest.setup.ts`에서 import하면 모든 테스트 파일에서 바로 사용할 수 있다.

### toBeInTheDocument

#### 개념

`expect(element).toBeInTheDocument()`는 해당 요소가 **현재 DOM에 존재하는지** 검증한다.
`queryBy...`와 함께 사용할 때 가장 자주 등장한다.

#### 예제 코드

```tsx
test("제목이 화면에 표시된다", () => {
  render(<h1>안녕하세요</h1>);

  expect(screen.getByText("안녕하세요")).toBeInTheDocument();
});

test("에러 메시지가 없다", () => {
  render(<Form />);

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
```

---

### toHaveTextContent

#### 개념

`expect(element).toHaveTextContent(text)`는 요소의 **텍스트 내용이 일치하는지** 검증한다.
문자열(부분 일치) 또는 정규식을 전달할 수 있다.

`getByText`가 요소를 찾는 쿼리라면, `toHaveTextContent`는 이미 찾은 요소의 텍스트를 검증하는 매처다.

#### 예제 코드

```tsx
test("장바구니에 수량이 표시된다", () => {
  render(<CartBadge count={3} />);

  const badge = screen.getByRole("status");

  expect(badge).toHaveTextContent("3"); // 부분 일치
  expect(badge).toHaveTextContent("3개"); // 부분 일치
  expect(badge).toHaveTextContent(/^3개$/); // 정규식으로 완전 일치
});
```

---

### toHaveClass

#### 개념

`expect(element).toHaveClass('클래스명')`은 요소가 **특정 CSS 클래스를 가지고 있는지** 검증한다.
여러 클래스를 동시에 검증하거나, `not`으로 클래스가 없음을 검증할 수 있다.

#### 예제 코드

```tsx
test("활성 탭에 active 클래스가 적용된다", () => {
  render(<Tab label="홈" isActive={true} />);

  const tab = screen.getByRole("tab", { name: "홈" });

  expect(tab).toHaveClass("active");
  expect(tab).toHaveClass("tab", "active"); // 여러 클래스 동시 검증
});

test("비활성 탭에 active 클래스가 없다", () => {
  render(<Tab label="설정" isActive={false} />);

  const tab = screen.getByRole("tab", { name: "설정" });

  expect(tab).not.toHaveClass("active");
});
```

---

### toBeDisabled

#### 개념

`expect(element).toBeDisabled()`는 요소가 **비활성화(disabled) 상태인지** 검증한다.
`disabled` 속성이 있거나 비활성화된 부모 안에 있을 때 통과한다.

#### 예제 코드

```tsx
test("약관 미동의 시 제출 버튼이 비활성화된다", () => {
  render(<SignupForm agreed={false} />);

  const submitButton = screen.getByRole("button", { name: "가입하기" });
  expect(submitButton).toBeDisabled();
});

test("약관 동의 후 제출 버튼이 활성화된다", () => {
  render(<SignupForm agreed={true} />);

  const submitButton = screen.getByRole("button", { name: "가입하기" });
  expect(submitButton).not.toBeDisabled();
});
```

---

### toBeChecked

#### 개념

`expect(element).toBeChecked()`는 **체크박스나 라디오 버튼이 선택된 상태인지** 검증한다.
`checked` 속성이 있거나 `aria-checked="true"`인 요소에서 통과한다.

#### 예제 코드

```tsx
test("초기 상태에서 알림 수신 체크박스가 선택되어 있다", () => {
  render(<NotificationSettings defaultChecked={true} />);

  const checkbox = screen.getByRole("checkbox", { name: "이메일 알림 수신" });
  expect(checkbox).toBeChecked();
});

test("체크 해제 후 체크박스가 선택되지 않은 상태다", () => {
  render(<NotificationSettings defaultChecked={false} />);

  const checkbox = screen.getByRole("checkbox", { name: "이메일 알림 수신" });
  expect(checkbox).not.toBeChecked();
});
```

---

## 5. 이벤트 발생

### fireEvent

#### 개념

`fireEvent`는 DOM 요소에 **합성 이벤트를 직접 발생**시키는 유틸리티다.
`@testing-library/dom`에서 제공하며, `fireEvent.이벤트명(요소, 이벤트옵션)`으로 사용한다.

`fireEvent`는 단순히 DOM 이벤트를 발생시키는 저수준 API다.
실제 사용자 행동(포커스 이동, 연속 이벤트 등)까지 재현하려면 `@testing-library/user-event`의 `userEvent`가 더 적합하다.

```
fireEvent   → DOM 이벤트 하나를 직접 발생 (낮은 수준, 빠름)
userEvent   → 실제 사용자 행동을 시뮬레이션 (높은 수준, 권장)
```

---

### fireEvent.click

#### 개념

`fireEvent.click(element)`는 요소에 **클릭 이벤트**를 발생시킨다.
버튼 클릭, 링크 클릭, 토글 등 가장 자주 사용하는 이벤트다.

#### 예제 코드

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "./Counter";

test("버튼 클릭 시 카운트가 증가한다", () => {
  render(<Counter />);

  const button = screen.getByRole("button", { name: "증가" });
  const count = screen.getByRole("status");

  expect(count).toHaveTextContent("0");

  fireEvent.click(button);
  expect(count).toHaveTextContent("1");

  fireEvent.click(button);
  expect(count).toHaveTextContent("2");
});
```

---

### 그 외 fireEvent

#### 개념

`fireEvent`는 클릭 외에도 다양한 DOM 이벤트를 지원한다.

| 메서드                                        | 발생 이벤트  | 주요 사용 상황                      |
| --------------------------------------------- | ------------ | ----------------------------------- |
| `fireEvent.change(el, { target: { value } })` | `change`     | input 값 변경                       |
| `fireEvent.input(el, { target: { value } })`  | `input`      | input 실시간 입력 (onChange 트리거) |
| `fireEvent.submit(el)`                        | `submit`     | 폼 제출                             |
| `fireEvent.focus(el)`                         | `focus`      | 요소에 포커스                       |
| `fireEvent.blur(el)`                          | `blur`       | 요소에서 포커스 해제                |
| `fireEvent.keyDown(el, { key, code })`        | `keydown`    | 키 누름 (Enter, Escape 등)          |
| `fireEvent.keyUp(el, { key, code })`          | `keyup`      | 키 뗌                               |
| `fireEvent.mouseEnter(el)`                    | `mouseenter` | 마우스 진입 (hover 효과 테스트)     |
| `fireEvent.mouseLeave(el)`                    | `mouseleave` | 마우스 이탈                         |

#### 예제 코드

**input 값 변경**

```tsx
test("이름을 입력하면 입력값이 반영된다", () => {
  render(<NameInput />);

  const input = screen.getByRole("textbox", { name: "이름" });
  fireEvent.change(input, { target: { value: "홍길동" } });

  expect(input).toHaveValue("홍길동");
});
```

**폼 제출**

```tsx
test("폼을 제출하면 onSubmit이 호출된다", () => {
  const handleSubmit = jest.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  const submitButton = screen.getByRole("button", { name: "로그인" });
  fireEvent.click(submitButton);

  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
```

**키보드 이벤트**

```tsx
test("Escape 키를 누르면 모달이 닫힌다", () => {
  render(<Modal isOpen={true} />);

  expect(screen.getByRole("dialog")).toBeInTheDocument();

  fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
```

> 실제 사용자 입력을 정밀하게 재현해야 할 때(타이핑, 탭 이동, 드래그 등)는 `@testing-library/user-event`의 `userEvent`를 사용하는 것이 권장된다.
