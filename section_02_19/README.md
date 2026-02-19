# 2026-02-19 학습 내용 정리

## Tailwind 유틸리티 라이브러리: clsx / tailwind-merge / cva

---

## 1. clsx

### 개요

조건부로 className을 조합할 때 사용하는 유틸리티 함수.
문자열, 객체, 배열, falsy 값 등을 받아 최종 className 문자열을 반환한다.

### 설치

```bash
npm install clsx
```

### 사용법

```ts
import clsx from "clsx";

// 기본
clsx("foo", "bar"); // "foo bar"

// 조건부
clsx("base", isActive && "active"); // isActive가 false면 "base"

// 객체 형태
clsx({ "text-red-500": hasError, "text-gray-500": !hasError });

// 배열 혼합
clsx(["px-4", "py-2"], { "opacity-50": disabled });
```

### 특징

- falsy 값(`false`, `null`, `undefined`, `0`, `""`)은 자동으로 무시됨
- Tailwind 클래스 충돌 해결은 하지 않음 → `tailwind-merge`와 함께 사용 필요

---

## 2. tailwind-merge (twMerge)

### 개요

Tailwind CSS 클래스 간의 **충돌을 자동으로 해결**해주는 유틸리티.
동일한 CSS 속성에 해당하는 클래스가 여러 개 있을 때 마지막 클래스만 남긴다.

### 설치

```bash
npm install tailwind-merge
```

### 사용법

```ts
import { twMerge } from "tailwind-merge";

// 충돌 해결: px-2가 px-4를 덮어씀
twMerge("px-4 py-2", "px-2"); // "py-2 px-2"

// 충돌 없는 경우: 모두 유지
twMerge("text-sm font-bold", "text-red-500"); // "text-sm font-bold text-red-500"
```

### clsx 없이 단독 사용 vs. clsx와 함께 사용

```ts
// 단독 사용 (문자열만 처리)
twMerge("bg-white", isActive ? "bg-blue-500" : "");

// clsx와 조합 (조건부 로직 + 충돌 해결 동시 처리)
twMerge(clsx("bg-white", { "bg-blue-500": isActive }));
```

> `clsx`로 조건부 조합을 처리하고, `twMerge`로 Tailwind 충돌을 해결하는 패턴이 표준처럼 사용된다.

### 프로젝트 적용 예시 (Input 컴포넌트)

```tsx
// app/components/Input/index.tsx
export default function Input({ className, type = "text", ...props }) {
  const inputClasses = twMerge(
    clsx(
      "w-full rounded-md border border-gray-300 px-3 py-1 shadow-xs",
      className, // 외부에서 전달한 className이 내부 클래스를 안전하게 오버라이드
    ),
  );
  return <input type={type} className={inputClasses} {...props} />;
}
```

---

## 3. cva (class-variance-authority)

### 개요

컴포넌트의 **변형(variant)** 을 타입 안전하게 정의하는 라이브러리.
`variant`, `size` 등의 prop에 따라 어떤 Tailwind 클래스를 적용할지 선언적으로 관리한다.

### 설치

```bash
npm install class-variance-authority
```

### 기본 구조

```ts
import { cva } from "class-variance-authority";

const component = cva(
  "베이스 클래스", // 항상 적용되는 기본 클래스
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white",
        secondary: "bg-gray-200 text-black",
      },
      size: {
        sm: "text-sm px-2 py-1",
        md: "text-base px-4 py-2",
        lg: "text-lg px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
```

### 프로젝트 적용 예시 (Badge 컴포넌트)

```tsx
// app/components/Badge/index.tsx
const badgeVariants = cva(
  "rounded-full bg-black px-2 py-1 text-xs font-medium text-white",
  {
    variants: {
      variant: {
        secondary: "bg-gray-200 text-black",
        destructive: "bg-red-500 text-white",
        outline: "bg-transparent text-black border border-gray-200",
      },
    },
  },
);

export default function Badge({ variant, className, children }) {
  return (
    <span className={twMerge(clsx(badgeVariants({ variant, className })))}>
      {children}
    </span>
  );
}
```

### 다중 variant 예시 (Card 컴포넌트)

```tsx
// app/components/Card/index.tsx
const cardVariant = cva("overflow-hidden transition-all max-w-md", {
  variants: {
    variant: {
      default:  "bg-white border border-gray-200",
      outlined: "bg-white border border-gray-500 hover:border-gray-400",
      elevated: "bg-white shadow-lg hover:shadow-xl",
    },
    padding: {
      none: "p-0",
      sm:   "p-3",
      md:   "p-5",
      lg:   "p-8",
    },
    radius: {
      none: "rounded-none",
      sm:   "rounded-sm",
      md:   "rounded-md",
      lg:   "rounded-lg",
      full: "rounded-full",
    },
  },
});

// 사용 시
<Card variant="outlined" padding="lg" radius="lg" />
<Card variant="elevated" className="max-w-lg bg-red-100" /> // twMerge 덕에 max-w-md → max-w-lg 충돌 해결
```

---

## 세 라이브러리의 역할 분담

| 라이브러리       | 역할                                |
| ---------------- | ----------------------------------- |
| `clsx`           | 조건부 className 조합               |
| `tailwind-merge` | Tailwind 클래스 충돌 해결           |
| `cva`            | 컴포넌트 variant 타입 안전하게 관리 |

### 함께 쓰는 표준 패턴

```ts
// cva로 variant 정의 → clsx로 조건부 조합 → twMerge로 충돌 해결
className={twMerge(clsx(someVariant({ variant, className })))}
```
