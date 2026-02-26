# 2026-02-26 학습 내용 정리 (Jest)

## 목차

1. [Jest란?](#1-jest란)
   - [개요](#개요)
   - [테스트가 필요한 이유](#테스트가-필요한-이유)
   - [Jest vs Vitest](#jest-vs-vitest)
2. [Jest Matchers](#2-jest-matchers)
   - [Jest Matcher란?](#jest-matcher란)
   - [기본 동등 비교](#기본-동등-비교)
   - [진리값](#진리값)
   - [숫자 비교](#숫자-비교)
   - [문자열](#문자열)
   - [배열과 이터러블](#배열과-이터러블)
   - [부정](#부정)
   - [예외 테스트](#예외-테스트)

---

## 1. Jest란?

### 개요

Facebook(Meta)이 만든 JavaScript **테스트 프레임워크**. 단위 테스트(Unit Test), 스냅샷(Snapshot) 등 다양한 테스트를 작성할 수 있음.

- **Zero Config**: 별도 설정 없이 바로 사용할 수 있도록 설계됨
- **Snapshot 테스트**: UI 컴포넌트의 렌더링 결과를 저장하고 비교하는 기능 제공
- **Code Coverage**: 테스트가 코드의 어느 부분을 실행했는지 리포트 제공
- **Mocking**: 함수, 모듈, 타이머 등을 가짜로 대체하는 기능 내장

```
Jest = Test Runner + Assertion Library + Mocking 기능
```

> 하나의 패키지로 테스트에 필요한 모든 기능을 제공한다는 점이 큰 장점

---

### 테스트가 필요한 이유

#### 버그를 조기에 발견

- 코드를 수정했을 때 **기존에 잘 동작하던 기능이 깨지는 것(Regression)** 을 즉시 감지할 수 있음
- 수동으로 모든 경우의 수를 확인하는 것은 현실적으로 불가능함

#### 리팩터링에 대한 자신감

- 테스트가 통과하는 한, 내부 구현을 마음껏 개선할 수 있음
- 테스트 없이 리팩터링하면 어디서 버그가 생겼는지 파악하기 어려움

#### 코드가 명세(Specification) 역할을 함

- 테스트 코드는 함수나 모듈이 **어떻게 동작해야 하는지**를 명확히 문서화함
- 새로운 팀원이 코드를 이해하는 데 도움이 됨

#### 협업 품질 향상

- PR(Pull Request) 단계에서 자동으로 테스트를 실행해 **코드 품질을 보장**할 수 있음
- CI/CD 파이프라인에 통합해 배포 전 검증 자동화 가능

```
테스트 없음: 코드 수정 → 배포 → 장애 발생 → 원인 파악 → 롤백
테스트 있음: 코드 수정 → 테스트 실패 → 즉시 인지 → 수정 후 배포
```

---

### Jest vs Vitest

| 항목                | Jest                                 | Vitest                                   |
| ------------------- | ------------------------------------ | ---------------------------------------- |
| **개발사**          | Meta(Facebook)                       | Vite 팀                                  |
| **출시**            | 2014년                               | 2021년                                   |
| **기반**            | Node.js (CommonJS)                   | Vite (ESM)                               |
| **속도**            | 보통                                 | 빠름 (Vite의 빠른 HMR 기반)              |
| **설정**            | Zero Config, 하지만 ESM/TS 설정 필요 | Vite 프로젝트라면 거의 Zero Config       |
| **API 호환성**      | Jest API가 표준                      | Jest API와 거의 동일 (마이그레이션 쉬움) |
| **생태계**          | 매우 성숙, 레퍼런스 풍부             | 빠르게 성장 중                           |
| **React / Next.js** | 공식 권장                            | Vite 기반 프로젝트에 적합                |
| **Snapshot 테스트** | 지원                                 | 지원                                     |
| **UI 모드**         | 없음                                 | 브라우저 UI 모드 제공                    |
| **Watch 모드**      | 지원                                 | 지원 (더 빠름)                           |

> Vitest는 Jest와 API가 거의 동일하기 때문에, Jest를 배워두면 Vitest로 전환하는 데 큰 어려움이 없음

---

## 2. Jest Matchers

### Jest Matcher란?

`expect(값)`으로 검증할 값을 지정한 뒤, **Matcher 메서드를 체이닝해 조건을 검증**하는 함수.
테스트가 통과하려면 Matcher 조건이 참(true)이어야 하며, 조건이 거짓이면 테스트가 실패함.

```js
expect(검증할 값).매처함수(기댓값);
```

---

### 기본 동등 비교

#### `.toBe(value)`

원시값의 **정확한 일치** 검사. 내부적으로 `Object.is`를 사용함 (`===`와 거의 동일).
객체/배열에는 사용하지 말 것 — 참조가 달라 실패함.

```js
test("2 더하기 2는 4이다", () => {
  expect(2 + 2).toBe(4);
});
```

#### `.toEqual(value)`

객체나 배열의 **깊은 동등 비교(deep equality)**. 참조가 달라도 내부 값이 같으면 통과.
`undefined` 프로퍼티와 배열의 빈 슬롯은 무시함.

```js
test("객체에 프로퍼티를 추가할 수 있다", () => {
  const data = { one: 1 };
  data["two"] = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});
```

> 원시값 → `toBe`, 객체/배열 → `toEqual`

---

### 진리값

JavaScript에서 falsy 값: `false`, `0`, `''`, `null`, `undefined`, `NaN`
그 외 모든 값은 truthy.

| Matcher            | 설명                      |
| ------------------ | ------------------------- |
| `.toBeTruthy()`    | truthy 값인지 검사        |
| `.toBeFalsy()`     | falsy 값인지 검사         |
| `.toBeNull()`      | `null`인지 검사           |
| `.toBeUndefined()` | `undefined`인지 검사      |
| `.toBeDefined()`   | `undefined`가 아닌지 검사 |

```js
test("null 검사", () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined(); // null은 undefined가 아님
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test("0 검사", () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```

---

### 숫자 비교

| Matcher                      | 설명                 |
| ---------------------------- | -------------------- |
| `.toBeGreaterThan(n)`        | `>` n                |
| `.toBeGreaterThanOrEqual(n)` | `>=` n               |
| `.toBeLessThan(n)`           | `<` n                |
| `.toBeLessThanOrEqual(n)`    | `<=` n               |
| `.toBeCloseTo(n, digits?)`   | 부동소수점 근사 비교 |

```js
test("2 더하기 2 숫자 비교", () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);
  expect(value).toBe(4);
  expect(value).toEqual(4);
});
```

`0.1 + 0.2 = 0.30000000000000004` 처럼 부동소수점 오차가 있는 경우 `toBe` 대신 `toBeCloseTo`를 사용함.

```js
test("부동소수점 덧셈", () => {
  const value = 0.1 + 0.2;
  // expect(value).toBe(0.3); // 실패!
  expect(value).toBeCloseTo(0.3); // 통과
});
```

---

### 문자열

#### `.toMatch(regexp | string)`

문자열이 정규식이나 부분 문자열과 **일치하는지** 검사.

```js
test("team에는 I가 없다", () => {
  expect("team").not.toMatch(/I/);
});

test("Christoph에는 stop이 포함된다", () => {
  expect("Christoph").toMatch(/stop/);
});
```

#### `.toContain(substring)`

문자열에 특정 **부분 문자열이 포함되는지** 검사.

```js
test("문자열에 '안녕'이 포함된다", () => {
  expect("안녕 세상아").toContain("안녕");
});
```

> `toMatch`는 정규식 패턴 검사, `toContain`은 부분 문자열 포함 여부 검사

---

### 배열과 이터러블

#### `.toContain(item)`

배열 또는 이터러블(Set, NodeList 등)에 특정 항목이 **포함되는지** 검사. `===` 기준으로 비교.

```js
const shoppingList = ["기저귀", "휴지", "쓰레기봉투", "키친타월", "우유"];

test("장보기 목록에 우유가 있다", () => {
  expect(shoppingList).toContain("우유");
  expect(new Set(shoppingList)).toContain("우유");
});
```

#### `.toContainEqual(item)`

배열 내 항목을 **깊은 동등 비교(deep equality)** 로 검사. 객체를 담은 배열에서 사용.

```js
test("내 음료는 맛있고 시지 않다", () => {
  const myBeverage = { delicious: true, sour: false };
  expect(myBeverages()).toContainEqual(myBeverage);
});
```

> `toContain` → 원시값 / `toContainEqual` → 객체

---

### 부정

#### `.not`

모든 Matcher 앞에 `.not`을 붙이면 조건을 **반전**시킬 수 있음.

```js
test("양수끼리 더한 결과는 0이 아니다", () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});
```

---

### 예외 테스트

#### `.toThrow(error?)`

함수가 **예외(에러)를 던지는지** 검사. 반드시 `expect()`에 함수를 감싸서 전달해야 함.

```js
function compileAndroidCode() {
  throw new Error("잘못된 JDK를 사용하고 있습니다!");
}

test("안드로이드 코드 컴파일이 예상대로 동작한다", () => {
  expect(() => compileAndroidCode()).toThrow(); // 에러 발생 여부만 검사
  expect(() => compileAndroidCode()).toThrow(Error); // 에러 타입 검사
  expect(() => compileAndroidCode()).toThrow("잘못된 JDK"); // 에러 메시지에 문자열 포함 여부
  expect(() => compileAndroidCode()).toThrow(/JDK/); // 에러 메시지 정규식 검사
});
```

> `expect(compileAndroidCode()).toThrow()` 처럼 **함수를 직접 실행해서 넘기면 안 됨** — 에러가 테스트 외부로 터져 나감. 반드시 `() => compileAndroidCode()` 처럼 감싸서 전달해야 함.
