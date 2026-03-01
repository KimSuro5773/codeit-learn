# 2026-02-27 학습 내용 정리 (Jest)

## 목차

1. [AAA 패턴](#1-aaa-패턴)
2. [모킹(Mocking) 기초](#2-모킹mocking-기초)
   - [모킹이란?](#모킹이란)
   - [jest.fn()](#jestfn)
   - [jest.spyOn()](#jestspyon)
   - [jest.mock()](#jestmock)
3. [반환값 모킹](#3-반환값-모킹)
   - [mockReturnValue / mockReturnValueOnce](#mockreturnvalue--mockreturnvalueonce)
4. [비동기 모킹](#4-비동기-모킹)
   - [mockResolvedValue / mockResolvedValueOnce](#mockresolvedvalue--mockresolvedvalueonce)
   - [mockRejectedValue / mockRejectedValueOnce](#mockrejectedvalue--mockrejectedvalueonce)
5. [호출 검증 매처](#5-호출-검증-매처)
   - [toHaveBeenCalled](#tohavebeencalled)
   - [toHaveBeenCalledWith](#tohavebeencalledwith)
   - [toHaveBeenCalledTimes](#tohavebeencalledtimes)
6. [값·구조 검증 매처](#6-값구조-검증-매처)
   - [toHaveProperty](#tohaveproperty)
   - [expect.objectContaining](#expectobjectcontaining)
   - [expect.arrayContaining](#expectarraycontaining)
   - [expect.assertions](#expectassertions)
7. [테스트 생명주기 훅](#7-테스트-생명주기-훅)
   - [beforeEach / afterEach](#beforeeach--aftereach)
   - [beforeAll / afterAll](#beforeall--afterall)
   - [실행 순서 정리](#실행-순서-정리)
8. [Mock 초기화](#8-mock-초기화)
   - [mockClear / mockReset / mockRestore](#mockclear--mockreset--mockrestore)
9. [비동기 코드 테스트](#9-비동기-코드-테스트)
   - [async/await 방식](#asyncawait-방식)
   - [Promise Chaining 방식](#promise-chaining-방식)
   - [에러 케이스 테스트](#에러-케이스-테스트)
   - [방식 비교](#방식-비교)

---

## 1. AAA 패턴

### 개념

AAA 패턴은 테스트 코드를 **Arrange(준비) → Act(실행) → Assert(검증)** 세 단계로 구조화하는 방법론이다.
각 단계를 명확히 구분해서 테스트의 의도를 한눈에 파악할 수 있게 한다.

| 단계 | 이름           | 설명                                           |
| ---- | -------------- | ---------------------------------------------- |
| A    | Arrange (준비) | 테스트에 필요한 초기 상태와 입력 값을 설정한다 |
| A    | Act (실행)     | 테스트 대상 코드(함수, 메서드 등)를 실행한다   |
| A    | Assert (검증)  | 실행 결과가 예상과 일치하는지 확인한다         |

### 예제 코드

```js
function add(a, b) {
  return a + b;
}

test("두 수를 더한 결과를 반환한다", () => {
  // Arrange: 테스트에 필요한 값 준비
  const a = 2;
  const b = 3;

  // Act: 테스트 대상 함수 실행
  const result = add(a, b);

  // Assert: 결과 검증
  expect(result).toBe(5);
});
```

> 세 단계를 주석이나 빈 줄로 구분해 작성하면 테스트의 흐름을 한눈에 파악할 수 있다.

---

## 2. 모킹(Mocking) 기초

### 모킹이란?

모킹(Mocking)은 테스트에서 **실제 구현 대신 가짜 함수나 모듈로 대체**하는 기법이다.
외부 API 호출, 데이터베이스 연결 등 **테스트하기 어렵거나 느린 의존성을 격리**할 때 사용한다.

```
실제 코드: fetchUser() → 서버에 HTTP 요청 → 응답 반환
모킹 적용: fetchUser() → 가짜 함수 → 미리 정해둔 값 즉시 반환
```

모킹을 사용하면:

- 외부 의존성 없이 테스트를 빠르게 실행할 수 있다
- 네트워크 오류, 서버 응답 지연 등 다양한 시나리오를 재현할 수 있다
- 특정 함수가 호출됐는지, 어떤 인수로 호출됐는지 검증할 수 있다

---

### jest.fn()

#### 개념

`jest.fn()`은 **아무것도 하지 않는 가짜 함수**를 생성한다.
호출 기록(횟수, 인수, 반환값)을 자동으로 추적하며, 반환값이나 구현을 자유롭게 지정할 수 있다.

#### 예제 코드

```js
// 기본: 아무것도 하지 않는 mock 함수 생성
const mockFn = jest.fn();
mockFn(1, 2);
mockFn(3);

// 호출 정보 확인
console.log(mockFn.mock.calls); // [[1, 2], [3]]  - 각 호출의 인수 목록
console.log(mockFn.mock.results); // [{type: 'return', value: undefined}, ...]

// 반환값 지정
const mockAdd = jest.fn().mockReturnValue(42);
console.log(mockAdd()); // 42
console.log(mockAdd()); // 42 (항상 같은 값 반환)

// 구현 직접 지정
const mockDouble = jest.fn((x) => x * 2);
console.log(mockDouble(5)); // 10
```

> `jest.fn()`으로 만든 함수는 `.mock` 프로퍼티를 통해 호출 내역에 접근할 수 있다.

---

### jest.spyOn()

#### 개념

`jest.spyOn(object, methodName)`은 **기존 객체의 메서드를 감시(spy)하는 mock 함수**를 생성한다.

`jest.fn()`과의 핵심 차이:

- `jest.fn()` → 완전히 새로운 가짜 함수를 만든다
- `jest.spyOn()` → **원본 함수를 그대로 실행**하면서 호출 여부와 인수만 추적한다

필요하면 `mockImplementation()`으로 구현을 교체하거나, 테스트 후 `mockRestore()`로 원본을 복원할 수 있다.

#### 예제 코드

```js
const calculator = {
  add(a, b) {
    return a + b;
  },
};

test("add 메서드가 호출됐는지 감시한다", () => {
  // Arrange: 원본 함수를 감시하는 spy 생성
  const spy = jest.spyOn(calculator, "add");

  // Act
  const result = calculator.add(2, 3);

  // Assert
  expect(result).toBe(5); // 원본 함수가 실제로 실행됨
  expect(spy).toHaveBeenCalled(); // 호출 여부 확인
  expect(spy).toHaveBeenCalledWith(2, 3); // 인수 확인

  // 정리: 원본 함수 복원
  spy.mockRestore();
});
```

원본을 실행하지 않고 구현을 교체하고 싶을 때는 `mockImplementation()`을 연결한다.

```js
test("console.warn 호출을 감시하고 출력을 막는다", () => {
  // 원본 console.warn 대신 아무것도 하지 않는 함수로 교체
  const spy = jest.spyOn(console, "warn").mockImplementation(() => {});

  someFunction(); // 내부에서 console.warn 호출

  expect(spy).toHaveBeenCalled();
  spy.mockRestore(); // 원본 console.warn 복원
});
```

---

### jest.mock()

#### 개념

`jest.mock('모듈경로')`는 **모듈 전체를 자동으로 모킹**한다.
모듈 안의 모든 export가 `jest.fn()`으로 대체되며, 테스트 파일 내 어디서 import해도 가짜 버전이 주입된다.

`jest.fn()`이나 `jest.spyOn()`이 **함수 단위** 모킹이라면, `jest.mock()`은 **모듈 단위** 모킹이다.

```
jest.fn()     → 가짜 함수 하나를 직접 만든다
jest.spyOn()  → 기존 객체의 메서드 하나를 감시한다
jest.mock()   → 모듈 전체를 통째로 가짜로 교체한다
```

> `jest.mock()` 호출은 파일 최상단으로 자동 호이스팅된다. `import` 구문보다 먼저 실행되므로 import한 모듈도 모킹된 버전으로 교체된다.

#### 예제 코드

**자동 모킹** — 모든 export를 `jest.fn()`으로 대체한다.

```js
// src/api.js
export async function fetchUser(id) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

export async function deleteUser(id) {
  await fetch(`/api/users/${id}`, { method: "DELETE" });
}
```

```js
// src/api.test.js
import { fetchUser, deleteUser } from "./api";

jest.mock("./api"); // api.js의 모든 export가 jest.fn()으로 대체됨

test("fetchUser가 모킹된다", async () => {
  fetchUser.mockResolvedValue({ id: 1, name: "홍길동" });

  const user = await fetchUser(1);

  expect(user).toEqual({ id: 1, name: "홍길동" });
  expect(fetchUser).toHaveBeenCalledWith(1);
});
```

**팩토리 함수로 직접 구현 지정** — 두 번째 인수로 팩토리 함수를 전달하면 모킹 내용을 직접 정의할 수 있다.

```js
jest.mock("./api", () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: "홍길동" }),
  deleteUser: jest.fn(),
}));
```

**일부만 모킹 (부분 모킹)** — `jest.requireActual()`로 원본 모듈을 가져온 뒤 일부만 교체한다.

```js
jest.mock("./utils", () => ({
  ...jest.requireActual("./utils"), // 나머지는 실제 구현 유지
  formatDate: jest.fn().mockReturnValue("2026-02-27"), // 이것만 교체
}));
```

---

## 3. 반환값 모킹

### mockReturnValue / mockReturnValueOnce

#### 개념

| API                          | 동작                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `mockReturnValue(value)`     | 호출할 때마다 **항상** `value`를 반환한다                                      |
| `mockReturnValueOnce(value)` | **딱 한 번만** `value`를 반환하고 이후엔 `mockReturnValue` 기본값으로 돌아간다 |

둘을 체이닝하면 **호출 순서별로 다른 반환값**을 시뮬레이션할 수 있다.

#### 예제 코드

```js
const mockFn = jest
  .fn()
  .mockReturnValue("기본값") // Once가 소진된 후 모든 호출에 적용
  .mockReturnValueOnce("첫 번째") // 1회차 호출
  .mockReturnValueOnce("두 번째"); // 2회차 호출

mockFn(); // "첫 번째"
mockFn(); // "두 번째"
mockFn(); // "기본값"
mockFn(); // "기본값"
```

재시도 로직처럼 **호출마다 다른 결과를 반환해야 하는 시나리오** 테스트에 유용하다.

```js
function retry(fn, times) {
  for (let i = 0; i < times; i++) {
    const result = fn();
    if (result !== null) return result;
  }
  return null;
}

test("두 번째 시도에 성공한다", () => {
  const mockFetch = jest
    .fn()
    .mockReturnValueOnce(null) // 첫 번째: 실패
    .mockReturnValueOnce("데이터"); // 두 번째: 성공

  const result = retry(mockFetch, 3);

  expect(result).toBe("데이터");
  expect(mockFetch).toHaveBeenCalledTimes(2);
});
```

---

## 4. 비동기 모킹

비동기 함수(API 호출 등)를 모킹할 때는 Promise를 반환하는 전용 API를 사용한다.

### mockResolvedValue / mockResolvedValueOnce

#### 개념

| API                            | 동작                                                  |
| ------------------------------ | ----------------------------------------------------- |
| `mockResolvedValue(value)`     | **항상** `value`로 resolve되는 Promise를 반환한다     |
| `mockResolvedValueOnce(value)` | **딱 한 번만** resolve하고 이후엔 기본값으로 돌아간다 |

`mockReturnValue`의 비동기 버전이라고 생각하면 된다.

#### 예제 코드

```js
// 실제 코드 (예시)
async function getUser(id) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// 테스트: fetch를 mock으로 대체
test("유저 정보를 반환한다", async () => {
  // Arrange
  const mockFetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({ id: 1, name: "홍길동" }),
  });
  global.fetch = mockFetch;

  // Act
  const user = await getUser(1);

  // Assert
  expect(user).toEqual({ id: 1, name: "홍길동" });
});
```

호출 순서별로 다른 응답을 반환하려면 `Once` 변형을 체이닝한다.

```js
const mockApi = jest
  .fn()
  .mockResolvedValue("기본 응답") // 이후 모든 호출
  .mockResolvedValueOnce("첫 번째 응답") // 첫 번째 호출
  .mockResolvedValueOnce("두 번째 응답"); // 두 번째 호출

await mockApi(); // "첫 번째 응답"
await mockApi(); // "두 번째 응답"
await mockApi(); // "기본 응답"
```

---

### mockRejectedValue / mockRejectedValueOnce

#### 개념

| API                            | 동작                                                    |
| ------------------------------ | ------------------------------------------------------- |
| `mockRejectedValue(error)`     | **항상** `error`로 reject되는 Promise를 반환한다        |
| `mockRejectedValueOnce(error)` | **딱 한 번만** reject하고 이후엔 다른 설정으로 돌아간다 |

API 호출 실패, 네트워크 오류 등 **에러 케이스**를 테스트할 때 사용한다.

#### 예제 코드

```js
async function fetchUserSafely(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    return await res.json();
  } catch {
    return null;
  }
}

test("API 호출 실패 시 null을 반환한다", async () => {
  // Arrange
  global.fetch = jest.fn().mockRejectedValue(new Error("Network Error"));

  // Act
  const result = await fetchUserSafely(1);

  // Assert
  expect(result).toBeNull();
});
```

성공/실패를 순서대로 시뮬레이션할 때는 `Resolved`와 `Rejected`의 `Once` 변형을 섞어 사용한다.

```js
test("첫 번째는 실패하고 두 번째는 성공한다", async () => {
  const mockApi = jest
    .fn()
    .mockRejectedValueOnce(new Error("서버 오류")) // 1회차: 실패
    .mockResolvedValueOnce({ data: "응답 데이터" }); // 2회차: 성공

  await expect(mockApi()).rejects.toThrow("서버 오류");
  await expect(mockApi()).resolves.toEqual({ data: "응답 데이터" });
});
```

---

## 5. 호출 검증 매처

Mock 함수가 **얼마나, 어떻게 호출됐는지** 검증하는 매처들이다.

### toHaveBeenCalled

#### 개념

`toHaveBeenCalled()`는 mock 함수가 **한 번 이상 호출됐는지**만 확인한다.
구체적인 인수나 횟수는 따지지 않는다.

#### 예제 코드

```js
function sendAlert(notify, message) {
  if (message.includes("오류")) {
    notify(message);
  }
}

test("오류 메시지가 있을 때 알림 함수를 호출한다", () => {
  const mockNotify = jest.fn();

  sendAlert(mockNotify, "서버 오류 발생");

  expect(mockNotify).toHaveBeenCalled(); // ✅ 호출됨
});

test("정상 메시지일 때 알림 함수를 호출하지 않는다", () => {
  const mockNotify = jest.fn();

  sendAlert(mockNotify, "정상 처리 완료");

  expect(mockNotify).not.toHaveBeenCalled(); // ✅ 호출 안 됨
});
```

---

### toHaveBeenCalledWith

#### 개념

`toHaveBeenCalledWith(...args)`는 mock 함수가 **특정 인수로 호출됐는지** 검증한다.
호출 여부뿐 아니라 **어떤 값을 전달했는지** 확인할 때 사용한다.

여러 번 호출됐을 때 n번째 호출의 인수를 검증하려면 `toHaveBeenNthCalledWith(n, ...args)`를 사용한다.

#### 예제 코드

```js
function placeOrder(saveOrder, item, quantity) {
  saveOrder({ item, quantity, status: "pending" });
}

test("주문 정보를 올바르게 저장한다", () => {
  const mockSave = jest.fn();

  placeOrder(mockSave, "사과", 3);

  expect(mockSave).toHaveBeenCalledWith({
    item: "사과",
    quantity: 3,
    status: "pending",
  });
});
```

```js
// n번째 호출의 인수 검증
test("각 음료를 순서대로 처리한다", () => {
  const mockDrink = jest.fn();
  ["레몬", "오렌지"].forEach(mockDrink);

  expect(mockDrink).toHaveBeenNthCalledWith(1, "레몬");
  expect(mockDrink).toHaveBeenNthCalledWith(2, "오렌지");
});
```

---

### toHaveBeenCalledTimes

#### 개념

`toHaveBeenCalledTimes(n)`은 mock 함수가 **정확히 n번 호출됐는지** 검증한다.

#### 예제 코드

```js
function processItems(handler, items) {
  items.forEach((item) => handler(item));
}

test("항목 수만큼 핸들러를 호출한다", () => {
  const mockHandler = jest.fn();
  const items = ["A", "B", "C"];

  processItems(mockHandler, items);

  expect(mockHandler).toHaveBeenCalledTimes(3); // 정확히 3번 호출
});
```

---

## 6. 값·구조 검증 매처

객체나 배열의 **구조와 내용**을 검증하는 매처들이다.

### toHaveProperty

#### 개념

`toHaveProperty(keyPath, value?)`는 객체가 **특정 경로에 프로퍼티를 가지고 있는지** 검증한다.
두 번째 인수로 값을 전달하면 **값까지 일치하는지** 함께 확인한다.
점 표기법(`.`)이나 배열로 **중첩 프로퍼티**에 접근할 수 있다.

#### 예제 코드

```js
const product = {
  id: 101,
  name: "노트북",
  spec: {
    cpu: "M3",
    ram: 16,
  },
  tags: ["전자기기", "컴퓨터"],
};

test("product 객체의 프로퍼티를 검증한다", () => {
  // 프로퍼티 존재 여부만 확인
  expect(product).toHaveProperty("id");
  expect(product).toHaveProperty("spec");
  expect(product).not.toHaveProperty("price");

  // 값까지 확인
  expect(product).toHaveProperty("name", "노트북");
  expect(product).toHaveProperty("spec.ram", 16); // 점 표기법으로 중첩 접근
  expect(product).toHaveProperty(["spec", "cpu"], "M3"); // 배열로 중첩 접근
  expect(product).toHaveProperty("tags.0", "전자기기"); // 배열 인덱스 접근
});
```

API 응답처럼 **특정 필드가 반드시 존재하는지** 검증할 때 유용하다.

```js
test("유저 응답에 필수 필드가 존재한다", async () => {
  const mockGetUser = jest.fn().mockResolvedValue({
    id: 1,
    name: "홍길동",
    email: "hong@example.com",
  });

  const user = await mockGetUser(1);

  expect(user).toHaveProperty("id");
  expect(user).toHaveProperty("email");
  expect(user).not.toHaveProperty("password"); // 민감 정보는 없어야 함
});
```

---

### expect.objectContaining

#### 개념

`expect.objectContaining(object)`는 수신한 객체가 **기대 객체의 모든 프로퍼티를 포함하면 통과**하는 비대칭 매처다.

`toEqual`과의 차이:

- `toEqual` → 객체가 **완전히 일치**해야 통과 (추가 프로퍼티 있으면 실패)
- `objectContaining` → 기대한 프로퍼티만 포함하면 통과 (**추가 프로퍼티 있어도 통과**)

`toHaveBeenCalledWith`와 함께 사용하면 **인수 객체의 일부 필드만 골라서 검증**할 수 있다.

#### 예제 코드

```js
function createOrder(saveOrder, item, quantity) {
  saveOrder({
    item,
    quantity,
    status: "pending",
    createdAt: new Date().toISOString(), // 테스트마다 달라지는 값
  });
}

test("주문 시 필수 정보가 올바르게 저장된다", () => {
  const mockSave = jest.fn();
  createOrder(mockSave, "사과", 3);

  // createdAt은 매번 달라지므로 제외하고 핵심 필드만 검증
  expect(mockSave).toHaveBeenCalledWith(
    expect.objectContaining({
      item: "사과",
      quantity: 3,
      status: "pending",
    }),
  );
});
```

값의 타입만 검증하고 싶을 때는 `expect.any(Constructor)`를 함께 사용한다.

```js
test("이벤트 핸들러가 좌표 객체와 함께 호출된다", () => {
  const onPress = jest.fn();
  simulatePress(onPress, { x: 150, y: 320 });

  expect(onPress).toHaveBeenCalledWith(
    expect.objectContaining({
      x: expect.any(Number),
      y: expect.any(Number),
    }),
  );
});
```

---

### expect.arrayContaining

#### 개념

`expect.arrayContaining(array)`는 수신한 배열이 **기대 배열의 모든 요소를 포함하면 통과**하는 비대칭 매처다.
기대 배열에 없는 **추가 요소가 있어도 통과**하며, **순서는 상관없다**.

`objectContaining`의 배열 버전이라고 생각하면 된다.

#### 예제 코드

```js
test("장바구니에 필수 상품이 담겨 있다", () => {
  const cart = ["사과", "바나나", "포도", "딸기"];

  // 사과와 포도가 포함되어 있으면 통과 (순서, 추가 항목 무관)
  expect(cart).toEqual(expect.arrayContaining(["사과", "포도"]));
});
```

`objectContaining`과 중첩해서 배열 안의 객체를 검증할 수도 있다.

```js
test("상품 목록에 특정 상품이 포함된다", () => {
  const products = [
    { id: 1, name: "사과", price: 1000 },
    { id: 2, name: "바나나", price: 500 },
  ];

  expect(products).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "사과" }), // 사과 객체가 포함되어 있으면 통과
    ]),
  );
});
```

---

### expect.assertions

#### 개념

`expect.assertions(n)`은 테스트 내에서 **정확히 n개의 assertion이 실행됐는지** 확인한다.

비동기 테스트에서 자주 발생하는 문제: `catch` 블록이 실행되지 않아도 테스트가 통과될 수 있다.
`expect.assertions(n)`을 선언해두면 n개의 검증이 실행되지 않을 경우 테스트가 **실패**한다.

#### 예제 코드

```js
// ❌ 위험한 방식: fetchData()가 성공하면 catch가 실행 안 돼도 테스트 통과
test("에러를 올바르게 처리한다 (위험한 방식)", async () => {
  try {
    await fetchData();
  } catch (error) {
    expect(error.message).toBe("Network Error"); // 이 줄이 실행 안 돼도 통과!
  }
});

// ✅ 안전한 방식: 반드시 1개의 assertion이 실행돼야 통과
test("에러를 올바르게 처리한다 (안전한 방식)", async () => {
  expect.assertions(1); // 테스트 함수 맨 위에 선언하는 것이 관례

  try {
    await fetchData();
  } catch (error) {
    expect(error.message).toBe("Network Error"); // 실행 안 되면 테스트 실패
  }
});
```

---

## 7. 테스트 생명주기 훅

각 테스트의 실행 전후에 공통 로직을 실행하는 훅이다.

### beforeEach / afterEach

#### 개념

| 훅           | 실행 시점        | 주요 용도                       |
| ------------ | ---------------- | ------------------------------- |
| `beforeEach` | **각** 테스트 전 | mock 초기화, 테스트 데이터 설정 |
| `afterEach`  | **각** 테스트 후 | mock 정리, 임시 파일 삭제       |

테스트마다 동일한 초기 상태를 보장하거나, 테스트 후 정리 작업을 할 때 사용한다.

#### 예제 코드

```js
let mockFetch;

beforeEach(() => {
  // 각 테스트 전: 새로운 mock 함수로 초기화
  mockFetch = jest.fn();
  global.fetch = mockFetch;
});

afterEach(() => {
  // 각 테스트 후: mock 호출 기록 초기화
  jest.clearAllMocks();
});

test("첫 번째 테스트: 사용자 조회 성공", async () => {
  mockFetch.mockResolvedValue({ ok: true, json: () => ({ name: "홍길동" }) });
  // ... 테스트 로직
});

test("두 번째 테스트: 이전 테스트의 mock 상태에 영향받지 않음", async () => {
  // beforeEach 덕분에 mockFetch는 항상 깨끗한 상태로 시작
  mockFetch.mockResolvedValue({ ok: false });
  // ... 테스트 로직
});
```

---

### beforeAll / afterAll

#### 개념

| 훅          | 실행 시점                              | 주요 용도                           |
| ----------- | -------------------------------------- | ----------------------------------- |
| `beforeAll` | 블록 내 **첫** 테스트 실행 전 딱 한 번 | DB 연결, 서버 시작 등 무거운 초기화 |
| `afterAll`  | 블록 내 **마지막** 테스트 후 딱 한 번  | DB 연결 해제, 서버 종료             |

한 번만 설정하면 되는 **비용이 큰 작업**에 적합하다.

#### 예제 코드

```js
let db;

beforeAll(async () => {
  // 모든 테스트 전 딱 한 번: DB 연결
  db = await createTestDatabase();
});

afterAll(async () => {
  // 모든 테스트 후 딱 한 번: DB 연결 해제
  await db.close();
});

test("사용자 조회", async () => {
  const user = await db.findUser(1);
  expect(user).toBeDefined();
});

test("사용자 생성", async () => {
  await db.createUser({ name: "김철수" });
  const user = await db.findUser(2);
  expect(user.name).toBe("김철수");
});
```

---

### 실행 순서 정리

`beforeAll`, `beforeEach`, `afterEach`, `afterAll`이 중첩된 `describe` 안에 함께 있을 때의 실행 순서이다.

```js
beforeAll(() => console.log("1 - beforeAll"));
afterAll(() => console.log("1 - afterAll"));
beforeEach(() => console.log("1 - beforeEach"));
afterEach(() => console.log("1 - afterEach"));

test("", () => console.log("1 - test"));

describe("중첩 블록", () => {
  beforeAll(() => console.log("2 - beforeAll"));
  afterAll(() => console.log("2 - afterAll"));
  beforeEach(() => console.log("2 - beforeEach"));
  afterEach(() => console.log("2 - afterEach"));

  test("", () => console.log("2 - test"));
});

// 출력 순서:
// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll       ← describe의 beforeAll은 해당 블록 직전에만 실행
// 1 - beforeEach      ← 상위 beforeEach는 중첩 test에도 적용
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach       ← 상위 afterEach도 중첩 test에 적용
// 2 - afterAll
// 1 - afterAll
```

핵심 규칙:

- 상위 `beforeEach` / `afterEach`는 **중첩된 describe 안의 테스트에도 적용**된다
- `beforeAll` / `afterAll`은 **자신이 속한 블록**에서만 실행된다

---

## 8. Mock 초기화

세 메서드 모두 mock을 정리하지만, **정리하는 범위**가 다르다.

### mockClear / mockReset / mockRestore

#### 개념

| 메서드          | 호출 기록 초기화 | 반환값·구현 초기화 | 원본 함수 복원 | 사용 상황                              |
| --------------- | :--------------: | :----------------: | :------------: | -------------------------------------- |
| `mockClear()`   |        ✅        |         ❌         |       ❌       | 테스트 간 호출 기록만 격리할 때        |
| `mockReset()`   |        ✅        |         ✅         |       ❌       | 반환값 설정까지 완전히 초기화할 때     |
| `mockRestore()` |        ✅        |         ✅         |       ✅       | `spyOn`으로 감싼 원본 함수를 되돌릴 때 |

> `mockRestore()`는 `jest.spyOn()`으로 만든 spy에만 의미가 있다. `jest.fn()`은 원본 함수 참조를 저장하지 않으므로 복원할 대상 자체가 없다. `jest.fn()`을 사용했다면 직접 원래 값으로 되돌려야 한다.

#### 예제 코드

```js
const mockFn = jest.fn().mockReturnValue(42);
mockFn();
mockFn();
console.log(mockFn.mock.calls.length); // 2

// mockClear: 호출 기록만 지운다. 반환값 설정은 유지된다.
mockFn.mockClear();
console.log(mockFn.mock.calls.length); // 0
console.log(mockFn()); // 42 ← 반환값은 그대로

// mockReset: 호출 기록 + 반환값·구현까지 모두 초기화한다.
mockFn.mockReset();
console.log(mockFn.mock.calls.length); // 0
console.log(mockFn()); // undefined ← 반환값도 초기화됨

// mockRestore: jest.spyOn으로 만든 spy를 원본 함수로 되돌린다.
const spy = jest.spyOn(console, "log").mockImplementation(() => {});
spy.mockRestore(); // 원본 console.log로 복원됨
```

---

## 9. 비동기 코드 테스트

비동기 함수를 테스트할 때는 Jest가 Promise가 완료될 때까지 기다리도록 올바르게 작성해야 한다.
**`await`나 `return`을 빠뜨리면 테스트가 Promise가 완료되기 전에 종료**되어 항상 통과하는 잘못된 테스트가 만들어진다.

---

### async/await 방식

#### 개념

테스트 함수에 `async`를 선언하고 비동기 호출마다 `await`를 붙이는 방식이다.
동기 코드와 가장 유사한 흐름으로 읽히기 때문에 **가독성이 높고 현재 가장 널리 사용**된다.

#### 예제 코드

```js
// 테스트 대상 함수
async function fetchUser(id) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("사용자를 찾을 수 없습니다");
  return res.json();
}
```

**성공 케이스**

```js
test("사용자 정보를 반환한다", async () => {
  // Arrange: fetch를 mock으로 대체
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ id: 1, name: "홍길동" }),
  });

  // Act: await로 Promise가 완료될 때까지 기다린다
  const user = await fetchUser(1);

  // Assert
  expect(user).toEqual({ id: 1, name: "홍길동" });
  expect(global.fetch).toHaveBeenCalledWith("/api/users/1");
});
```

**에러 케이스 — `rejects` 매처 사용**

```js
test("응답이 실패하면 에러를 던진다", async () => {
  // Arrange
  global.fetch = jest.fn().mockResolvedValue({ ok: false });

  // Assert: rejects 매처와 await를 함께 써야 한다
  await expect(fetchUser(1)).rejects.toThrow("사용자를 찾을 수 없습니다");
});
```

> `await expect(...).rejects.toThrow()`에서 `await`를 생략하면 Promise가 reject되어도 테스트가 통과해버린다.

---

### Promise Chaining 방식

#### 개념

`.then()` / `.catch()`를 연결해서 비동기 흐름을 처리하는 방식이다.
테스트 함수에서 반드시 **Promise를 `return`** 해야 Jest가 완료를 기다린다.
`return`을 빠뜨리면 Promise가 완료되기 전에 테스트가 종료되어 항상 통과하는 오류가 생긴다.

#### 예제 코드

**성공 케이스**

```js
test("사용자 정보를 반환한다", () => {
  // Arrange
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ id: 1, name: "홍길동" }),
  });

  // return을 반드시 붙여야 Jest가 Promise 완료를 기다린다
  return fetchUser(1).then((user) => {
    expect(user).toEqual({ id: 1, name: "홍길동" });
  });
});
```

**에러 케이스 — `.catch()` 사용**

```js
test("응답이 실패하면 에러를 던진다", () => {
  // Arrange
  global.fetch = jest.fn().mockResolvedValue({ ok: false });

  // expect.assertions로 catch가 반드시 실행됨을 보장한다
  expect.assertions(1);

  return fetchUser(1).catch((error) => {
    expect(error.message).toBe("사용자를 찾을 수 없습니다");
  });
});
```

> `expect.assertions(1)`을 선언하지 않으면 `fetchUser`가 성공했을 때 `.catch()`가 실행되지 않아도 테스트가 통과된다.

**`resolves` / `rejects` 매처 사용**

Promise를 직접 체이닝하는 대신 Jest의 `resolves` / `rejects` 매처에 Promise를 전달하는 방법도 있다.
두 가지 스타일 모두 지원하며, **사용하는 스타일에 따라 `return` 또는 `await`가 반드시 필요**하다.

```js
// ── Promise Chaining 스타일: return 필요 ──

test("사용자 정보를 반환한다", () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ id: 1, name: "홍길동" }),
  });

  return expect(fetchUser(1)).resolves.toEqual({ id: 1, name: "홍길동" });
});

test("응답이 실패하면 에러를 던진다", () => {
  expect.assertions(1);
  global.fetch = jest.fn().mockResolvedValue({ ok: false });

  return expect(fetchUser(1)).rejects.toThrow("사용자를 찾을 수 없습니다");
});

// ── async/await 스타일: await 필요 ──

test("사용자 정보를 반환한다", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ id: 1, name: "홍길동" }),
  });

  await expect(fetchUser(1)).resolves.toEqual({ id: 1, name: "홍길동" });
});

test("응답이 실패하면 에러를 던진다", async () => {
  expect.assertions(1);
  global.fetch = jest.fn().mockResolvedValue({ ok: false });

  await expect(fetchUser(1)).rejects.toThrow("사용자를 찾을 수 없습니다");
});
```

> `rejects` 매처 사용 시 `expect.assertions(1)`을 함께 선언하면 reject가 발생하지 않았을 때 테스트가 그냥 통과되는 것을 방지할 수 있다.

---

### 에러 케이스 테스트

비동기 에러를 테스트하는 방법은 세 가지다. 상황에 따라 적합한 방식을 선택한다.

| 방식                       | 코드                                           | 특징                                         |
| -------------------------- | ---------------------------------------------- | -------------------------------------------- |
| `rejects` 매처 + `await`   | `await expect(fn()).rejects.toThrow(msg)`      | 가장 간결하고 권장되는 방식                  |
| `rejects` 매처 + `return`  | `return expect(fn()).rejects.toThrow(msg)`     | Promise Chaining 스타일과 일관성 유지        |
| `try/catch` + `assertions` | `expect.assertions(1)` + `catch` 블록에서 검증 | 에러 객체의 세부 프로퍼티까지 검증할 때 유용 |

```js
// ① rejects 매처 + await (권장)
test("에러 메시지를 검증한다", async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error("Network Error"));

  await expect(fetchUser(1)).rejects.toThrow("Network Error");
});

// ② try/catch + assertions (에러 객체 상세 검증)
test("에러 객체의 프로퍼티를 검증한다", async () => {
  expect.assertions(2); // catch 블록 안의 assertion 2개가 반드시 실행돼야 한다

  const networkError = new Error("Network Error");
  networkError.statusCode = 503;
  global.fetch = jest.fn().mockRejectedValue(networkError);

  try {
    await fetchUser(1);
  } catch (error) {
    expect(error.message).toBe("Network Error");
    expect(error.statusCode).toBe(503);
  }
});
```

---

### 방식 비교

| 항목      | async/await                        | Promise Chaining                         |
| --------- | ---------------------------------- | ---------------------------------------- |
| 가독성    | 동기 코드처럼 읽혀 직관적이다      | 중첩이 깊어지면 가독성이 떨어질 수 있다  |
| 실수 위험 | `await` 누락 시 항상 통과하는 오류 | `return` 누락 시 항상 통과하는 오류      |
| 에러 처리 | `try/catch` 또는 `rejects` 매처    | `.catch()` 또는 `rejects` 매처           |
| 권장 상황 | 대부분의 경우                      | Promise를 직접 반환하는 유틸 함수 테스트 |

어느 방식을 쓰든 **Promise 완료를 Jest에게 알리는 것**이 핵심이다.

- `async/await` → `await` 키워드로 대기
- Promise Chaining → `return`으로 Promise를 반환
