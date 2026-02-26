# 2026-02-26 학습 내용 정리

## 목차

1. [객체 데이터를 웹 스토리지에 저장하기](#1-객체-데이터를-웹-스토리지에-저장하기)
   - [웹 스토리지에 객체를 저장할 수 없는 이유](#1-웹-스토리지에-객체를-저장할-수-없는-이유)
   - [객체를 문자열로 변환하기 (JSON.stringify)](#2-객체를-문자열로-변환하기-jsonstringify)
   - [문자열을 객체로 변환하기 (JSON.parse)](#3-문자열을-객체로-변환하기-jsonparse)
2. [XSS & CSRF](#2-xss--csrf)
   - [XSS란?](#1-xss-cross-site-scripting)
   - [XSS 공격 방지 방법](#2-xss-공격-방지-방법)
   - [CSRF란?](#3-csrf-cross-site-request-forgery)
   - [CSRF 공격 방지 방법](#4-csrf-공격-방지-방법)
   - [XSS와 CSRF 차이점 정리](#5-xss와-csrf-차이점-정리)

---

## 1. 객체 데이터를 웹 스토리지에 저장하기

### 1. 웹 스토리지에 객체를 저장할 수 없는 이유

웹 스토리지(localStorage, sessionStorage)는 **문자열(string) 타입만 저장 가능**하다.
JavaScript 객체를 그대로 `setItem`에 전달하면, 브라우저는 해당 값을 자동으로 문자열로 변환한다.
이때 `.toString()`이 호출되어 객체가 `"[object Object]"` 라는 의미 없는 문자열로 저장된다.

```js
const user = { name: "홍길동", age: 30 };

localStorage.setItem("user", user);

// 저장된 값 확인
localStorage.getItem("user"); // "[object Object]" ← 원래 데이터가 손실됨
```

> 객체 구조 자체를 보존하려면 문자열로 **직렬화(serialize)** 해서 저장하고, 읽을 때 다시 **역직렬화(deserialize)** 해야 한다.

---

### 2. 객체를 문자열로 변환하기 (JSON.stringify)

`JSON.stringify()`는 JavaScript 값을 **JSON 형식의 문자열로 변환**하는 내장 함수이다.
객체나 배열을 웹 스토리지에 저장하기 전에 이 함수를 사용해 문자열로 변환한다.

```js
const user = { name: "홍길동", age: 30 };

// 객체 → JSON 문자열
const serialized = JSON.stringify(user);
console.log(serialized); // '{"name":"홍길동","age":30}'
console.log(typeof serialized); // "string"

// 웹 스토리지에 저장
localStorage.setItem("user", serialized);
```

배열도 동일하게 처리할 수 있다.

```js
const cart = [
  { id: 1, name: "사과", count: 3 },
  { id: 2, name: "바나나", count: 1 },
];

localStorage.setItem("cart", JSON.stringify(cart));
```

> `JSON.stringify`는 `undefined`, 함수(`function`), `Symbol` 타입의 값은 변환하지 않고 제거한다.

---

### 3. 문자열을 객체로 변환하기 (JSON.parse)

`JSON.parse()`는 JSON 형식의 문자열을 다시 **JavaScript 값(객체, 배열 등)으로 변환**하는 내장 함수이다.
웹 스토리지에서 데이터를 읽은 후 이 함수를 사용해 원래 타입으로 복원한다.

```js
// 웹 스토리지에서 문자열 읽기
const serialized = localStorage.getItem("user");
console.log(serialized); // '{"name":"홍길동","age":30}'
console.log(typeof serialized); // "string"

// JSON 문자열 → 객체
const user = JSON.parse(serialized);
console.log(user); // { name: "홍길동", age: 30 }
console.log(user.name); // "홍길동"
```

배열도 동일하게 복원할 수 있다.

```js
const cart = JSON.parse(localStorage.getItem("cart"));
console.log(cart[0].name); // "사과"
```

`localStorage.getItem`은 키가 없으면 `null`을 반환한다.
`null`을 `JSON.parse`에 넘기면 오류가 발생할 수 있으므로, 값이 존재하는지 먼저 확인하는 것이 좋다.

```js
const raw = localStorage.getItem("user");
const user = raw ? JSON.parse(raw) : null;
```

#### JSON.stringify / JSON.parse 흐름 정리

```
저장할 때: 객체  →  JSON.stringify()  →  문자열  →  localStorage.setItem()
읽을 때:   localStorage.getItem()  →  문자열  →  JSON.parse()  →  객체
```

---

## 2. XSS & CSRF

### 1. XSS (Cross-Site Scripting)

공격자가 웹 페이지에 **악성 스크립트를 삽입**하여, 해당 페이지를 방문한 다른 사용자의 브라우저에서 스크립트가 실행되도록 하는 공격이다.
주로 사용자 입력값이 검증 없이 HTML에 그대로 출력될 때 발생한다.

```
공격자가 악성 스크립트를 게시글, URL 파라미터 등에 삽입
     ↓
피해자가 해당 페이지를 방문
     ↓
브라우저가 스크립트를 실행 → 쿠키 탈취, 세션 하이재킹, 피싱 페이지 리다이렉트 등
```

```html
<!-- 공격 예시: 입력값이 그대로 렌더링될 때 -->
<input value="<script>document.cookie를 공격자 서버로 전송</script>" />
```

---

### 2. XSS 공격 방지 방법

#### HttpOnly / Secure 쿠키 속성

- `HttpOnly`를 설정하면 JavaScript로 쿠키에 접근할 수 없으므로, XSS로 쿠키를 탈취하는 것을 방지할 수 있다.
- `Secure`를 함께 설정하면 HTTPS 연결에서만 쿠키가 전송된다.

```
Set-Cookie: token=abc123; HttpOnly; Secure
```

> XSS 공격이 성공해도 `HttpOnly` 쿠키는 `document.cookie`로 읽을 수 없으므로 피해를 최소화할 수 있다.

#### 유효성 검사 (Input Validation)

사용자 입력값이 서버에 도달하기 전, 또는 저장되기 전에 **허용된 형식인지 검증**한다.
예를 들어 이메일 필드에는 이메일 형식만, 숫자 필드에는 숫자만 허용한다.

```js
// 이메일 형식 검증 예시
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
```

#### Escape 및 입력값 검증 (Output Encoding)

HTML에 사용자 입력값을 출력할 때, 스크립트로 해석될 수 있는 특수 문자를 **HTML 엔티티로 변환(Escape)** 한다.

| 원래 문자 | 변환 결과 |
| --------- | --------- |
| `<`       | `&lt;`    |
| `>`       | `&gt;`    |
| `&`       | `&amp;`   |
| `"`       | `&quot;`  |
| `'`       | `&#x27;`  |

```js
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
```

> React는 JSX에서 기본적으로 문자열을 자동으로 Escape 처리하므로 대부분의 XSS를 방지한다.

#### dangerouslySetInnerHTML 사용 피하기

React의 `dangerouslySetInnerHTML`은 HTML 문자열을 그대로 DOM에 삽입하므로 XSS에 취약하다.
반드시 사용해야 한다면 DOMPurify 같은 라이브러리로 HTML을 정제(sanitize)한 후 사용한다.

```jsx
// 위험한 방식 ❌
<div dangerouslySetInnerHTML={{ __html: userInput }} />;

// DOMPurify로 정제 후 사용 ✅
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />;
```

---

### 3. CSRF (Cross-Site Request Forgery)

공격자가 **피해자가 이미 로그인된 상태**를 악용하여, 피해자의 권한으로 의도하지 않은 요청을 서버에 보내도록 하는 공격이다.
피해자의 브라우저가 자동으로 쿠키를 함께 전송하는 특성을 이용한다.

```
피해자가 사이트 A에 로그인 중 (쿠키 보유)
     ↓
공격자가 만든 악성 사이트 B를 방문
     ↓
악성 사이트 B가 사이트 A로 자동 요청 전송 (쿠키 자동 포함)
     ↓
사이트 A의 서버는 정상 요청으로 인식 → 계좌 이체, 비밀번호 변경 등 실행
```

> XSS는 **클라이언트(브라우저)** 를 공격 대상으로 삼고, CSRF는 **서버**를 공격 대상으로 삼는다.

---

### 4. CSRF 공격 방지 방법

#### SameSite 쿠키 속성 설정

`SameSite` 속성을 설정하면 cross-site 요청 시 쿠키가 자동으로 전송되는 것을 제한할 수 있다.

| 값       | 설명                                           |
| -------- | ---------------------------------------------- |
| `Strict` | 같은 사이트 요청에만 쿠키 전송                 |
| `Lax`    | 같은 사이트 + 일부 안전한 cross-site 요청 허용 |
| `None`   | 모든 요청에 쿠키 전송 (Secure 필수)            |

```
Set-Cookie: token=abc123; SameSite=Strict; Secure
```

#### CSRF 토큰 사용

서버가 **예측 불가능한 랜덤 토큰(CSRF 토큰)** 을 발급하고, 클라이언트는 폼 또는 요청 헤더에 이 토큰을 포함시켜 전송한다.
서버는 요청에 포함된 토큰이 유효한지 검증하여 정상 요청인지 판별한다.

```html
<!-- 폼에 CSRF 토큰 포함 -->
<form method="POST" action="/transfer">
  <input type="hidden" name="_csrf" value="서버에서_발급한_랜덤_토큰" />
  <!-- 나머지 폼 필드 -->
</form>
```

> 악성 사이트는 CSRF 토큰 값을 알 수 없으므로 요청을 위조할 수 없다.

#### Referer 검증

서버가 요청의 `Referer` 헤더를 확인하여 **요청이 신뢰할 수 있는 출처에서 왔는지** 검증한다.
`Referer`가 다른 도메인이면 요청을 거부한다.

```
Referer: https://example.com/mypage  → 신뢰할 수 있는 출처 ✅
Referer: https://evil-site.com       → 요청 거부 ❌
```

> `Referer` 헤더는 브라우저 설정이나 프록시에 의해 생략될 수 있으므로 단독으로 사용하기보다 다른 방법과 함께 사용하는 것이 좋다.

#### 데이터 변경 시 GET 요청 자제

GET 요청은 URL에 포함되어 링크 클릭, 이미지 로드 등 다양한 방식으로 쉽게 위조할 수 있다.
데이터를 생성·수정·삭제하는 작업에는 반드시 **POST, PUT, DELETE** 등의 메서드를 사용한다.

```
// 잘못된 방식 ❌
GET /transfer?to=attacker&amount=100000

// 올바른 방식 ✅
POST /transfer
Body: { to: "recipient", amount: 100000 }
```

---

### 5. XSS와 CSRF 차이점 정리

| 항목        | XSS                                             | CSRF                                   |
| ----------- | ----------------------------------------------- | -------------------------------------- |
| 공격 방식   | 악성 스크립트를 삽입해 피해자 브라우저에서 실행 | 피해자 권한으로 서버에 위조 요청 전송  |
| 공격 대상   | 클라이언트 (브라우저)                           | 서버                                   |
| 전제 조건   | 입력값이 검증 없이 HTML에 출력됨                | 피해자가 대상 서버에 로그인된 상태     |
| 주요 피해   | 쿠키 탈취, 세션 하이재킹, 피싱                  | 의도치 않은 데이터 변경, 계좌 이체 등  |
| 주요 방어책 | HttpOnly, Escape, 입력값 검증                   | SameSite 쿠키, CSRF 토큰, Referer 검증 |
