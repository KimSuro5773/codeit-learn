# 2026-02-20 학습 내용 정리

## 목차

1. [next-themes + Tailwind 다크모드](#1-next-themes--tailwind-다크모드)
   - 1-1. [next-themes 설치](#1-1-next-themes-설치)
   - 1-2. [Tailwind CSS 다크모드 설정](#1-2-tailwind-css-다크모드-설정)
   - 1-3. [ThemeProvider 설정](#1-3-themeprovider-설정-layouttsx)
   - 1-4. [테마 전환 버튼 구현](#1-4-테마-전환-버튼-구현-themebutton)
   - 1-5. [dynamic으로 하이드레이션 에러 완전 차단](#1-5-dynamic으로-하이드레이션-에러-완전-차단-pagetsx)
   - 1-6. [다크모드 클래스 사용법](#1-6-다크모드-클래스-사용법)
2. [Tailwind 반응형 디자인](#2-tailwind-반응형-디자인)
   - 2-1. [기본 사용법](#2-1-기본-사용법)
   - 2-2. [Breakpoint 커스텀](#2-2-breakpoint-커스텀)
   - 2-3. [clamp를 이용한 유동적 타이포그래피](#2-3-clamp를-이용한-유동적-타이포그래피)
3. [Tailwind v4 커스텀 테마](#3-tailwind-v4-커스텀-테마)
   - 3-1. [v3 → v4 핵심 변경점](#3-1-v3--v4-핵심-변경점)
   - 3-2. [@theme 블록과 네임스페이스 규칙](#3-2-theme-블록과-네임스페이스-규칙)
   - 3-3. [색상 토큰 등록 및 사용](#3-3-색상-토큰-등록-및-사용)
   - 3-4. [폰트 토큰 등록 및 사용](#3-4-폰트-토큰-등록-및-사용)
   - 3-5. [간격·크기 토큰 등록](#3-5-간격크기-토큰-등록)
   - 3-6. [다크모드와 @theme 연동](#3-6-다크모드와-theme-연동)

---

## 1. next-themes + Tailwind 다크모드

---

### 1-1. next-themes 설치

```bash
npm install next-themes
```

---

### 1-2. Tailwind CSS 다크모드 설정

`tailwind.config.ts`에서 다크모드 전략을 `class`로 설정한다.

```ts
// tailwind.config.ts
const config = {
  darkMode: "class", // <html class="dark"> 기반으로 다크모드 적용
};
```

`class` 방식은 `<html>` 태그에 `dark` 클래스가 붙어있을 때만 `dark:` 접두사 클래스가 적용된다.

---

### 1-3. ThemeProvider 설정 (layout.tsx)

`next-themes`의 `ThemeProvider`로 앱 전체를 감싼다.

```tsx
// app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class" // <html>의 class 속성으로 테마 적용
          defaultTheme="system" // 기본값: 시스템 설정 따름
          enableSystem // 시스템 다크모드 감지 활성화
          disableTransitionOnChange // 테마 전환 시 transition 비활성화 (깜빡임 방지)
          enableColorScheme={false} // color-scheme CSS 속성 자동 설정 비활성화
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### `suppressHydrationWarning`이 필요한 이유

`next-themes`는 마운트 시 `<html class="dark">`처럼 클래스를 동적으로 변경한다.
서버에서 렌더링한 HTML과 클라이언트에서 테마를 적용한 결과가 달라 하이드레이션 불일치가 발생할 수 있는데,
`suppressHydrationWarning`은 이 경고를 `<html>` 태그에 한해서만 억제한다.

또한 `ThemeProvider`는 내부적으로 인라인 스크립트를 주입해, React 하이드레이션 전에
`localStorage`를 읽고 미리 `<html>` 클래스를 설정하여 화면 깜빡임(FOUC)을 방지한다.

---

### 1-4. 테마 전환 버튼 구현 (ThemeButton)

`useTheme` 훅으로 현재 테마를 읽고 변경할 수 있다.
`useTheme`은 클라이언트에서만 동작하므로 반드시 `"use client"` 선언이 필요하다.

```tsx
// app/components/ThemeButton/index.tsx
"use client";

import { useTheme } from "next-themes";

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-4">
      <button onClick={() => setTheme("system")}>시스템</button>
      <button onClick={() => setTheme("dark")}>다크</button>
      <button onClick={() => setTheme("light")}>라이트</button>
    </div>
  );
}
```

---

### 1-5. `dynamic`으로 하이드레이션 에러 완전 차단 (page.tsx)

`ThemeProvider` + `suppressHydrationWarning` 조합으로도 하이드레이션 에러를 방지할 수 있지만,
`next/dynamic`의 `ssr: false` 옵션을 사용하면 컴포넌트를 서버에서 아예 렌더링하지 않아 불일치 자체를 원천 차단할 수 있다.

```tsx
// app/page.tsx
"use client";

import dynamic from "next/dynamic";

const ThemeToggle = dynamic(() => import("./components/ThemeButton"), {
  ssr: false, // 서버에서 렌더링하지 않음 → 하이드레이션 불일치 원천 차단
});
```

### 두 방식 비교

| 방식                                                  | 동작                     | 특징                          |
| ----------------------------------------------------- | ------------------------ | ----------------------------- |
| `suppressHydrationWarning` + `ThemeProvider` 스크립트 | 불일치 발생 후 경고 억제 | 소극적 방어                   |
| `dynamic({ ssr: false })`                             | 서버 렌더링 자체를 생략  | 적극적 방어, 불일치 원천 차단 |

---

### 1-6. 다크모드 클래스 사용법

`dark:` 접두사를 붙이면 다크모드일 때만 해당 스타일이 적용된다.

```tsx
// 배경색
<main className="bg-white dark:bg-gray-900">

// 텍스트 색상
<h1 className="text-black dark:text-white">

// 카드
<div className="bg-white dark:bg-gray-800">

// 버튼
<button className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
```

---

## 2. Tailwind 반응형 디자인

---

### 2-1. 기본 사용법

Tailwind는 **모바일 우선(Mobile First)** 방식으로 동작한다.
접두사 없는 클래스는 모든 크기에 적용되고, 접두사가 붙은 클래스는 해당 breakpoint **이상**에서 적용된다.

```
없음  → 모든 화면 (0px ~)
sm:   → 640px 이상
md:   → 768px 이상
lg:   → 1024px 이상
xl:   → 1280px 이상
2xl:  → 1536px 이상
```

```tsx
// 모바일: 1열 / 태블릿(md): 2열 / 데스크탑(lg): 3열
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// 모바일: 텍스트 작게 / 데스크탑(lg): 텍스트 크게
<h1 className="text-xl lg:text-4xl font-bold">

// 모바일: 숨김 / md 이상: 표시
<nav className="hidden md:block">
```

> 기본(접두사 없음)이 모바일, 큰 접두사로 갈수록 큰 화면에 오버라이드하는 방식으로 작성한다.

---

### 2-2. Breakpoint 커스텀

`tailwind.config.ts`의 `theme.screens`에서 breakpoint를 직접 정의할 수 있다.

#### 기본값 완전 교체

```ts
// tailwind.config.ts
const config = {
  theme: {
    screens: {
      tablet: "640px",
      laptop: "1024px",
      desktop: "1280px",
    },
  },
};
```

```tsx
// 커스텀 breakpoint 사용
<div className="block tablet:hidden laptop:flex">
```

#### 기본값 유지하면서 추가 (`extend`)

```ts
const config = {
  theme: {
    extend: {
      screens: {
        xs: "480px", // sm(640px) 아래에 추가
        "3xl": "1920px", // 2xl(1536px) 위에 추가
      },
    },
  },
};
```

#### `max-` 접두사로 최대 너비 기준 적용

```ts
const config = {
  theme: {
    extend: {
      screens: {
        "max-md": { max: "767px" }, // 767px 이하에서만 적용
      },
    },
  },
};
```

```tsx
<p className="max-md:hidden"> {/* 768px 미만에서 숨김 */}
```

---

### 2-3. clamp를 이용한 유동적 타이포그래피

`clamp(최솟값, 선호값, 최댓값)` CSS 함수를 사용하면 breakpoint 없이 화면 크기에 따라 값이 자연스럽게 변한다.

#### Tailwind에서 임의 값(Arbitrary Value)으로 사용

```tsx
// 화면 크기에 따라 1rem ~ 3rem 사이에서 유동적으로 변하는 폰트
<h1 className="text-[clamp(1rem,5vw,3rem)]">
  유동적인 제목
</h1>

// 유동적인 패딩
<div className="px-[clamp(1rem,4vw,4rem)]">
```

#### `tailwind.config.ts`에 유틸리티로 등록

반복 사용하는 `clamp` 값은 config에 등록해두면 편하다.

```ts
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      fontSize: {
        "fluid-sm": "clamp(0.875rem, 2vw, 1rem)",
        "fluid-base": "clamp(1rem, 3vw, 1.25rem)",
        "fluid-lg": "clamp(1.25rem, 4vw, 2rem)",
        "fluid-xl": "clamp(1.5rem, 5vw, 3rem)",
      },
      spacing: {
        "fluid-section": "clamp(2rem, 8vw, 8rem)",
      },
    },
  },
};
```

```tsx
// 등록한 유틸리티 사용
<h1 className="text-fluid-xl">제목</h1>
<section className="py-fluid-section">섹션</section>
```

#### breakpoint vs clamp 비교

|             | breakpoint (`md:`, `lg:`)             | clamp                          |
| ----------- | ------------------------------------- | ------------------------------ |
| 전환 방식   | 특정 너비에서 **즉시** 변경           | 너비에 따라 **부드럽게** 변경  |
| 사용 난이도 | 직관적                                | 수식 계산 필요                 |
| 적합한 경우 | 레이아웃 구조 변경 (열 수, 표시/숨김) | 폰트 크기, 간격 등 점진적 변화 |

---

## 3. Tailwind v4 커스텀 테마

---

### 3-1. v3 → v4 핵심 변경점

|           | Tailwind v3                               | Tailwind v4                            |
| --------- | ----------------------------------------- | -------------------------------------- |
| 설정 파일 | `tailwind.config.ts`                      | 없음 (`globals.css`로 통합)            |
| 테마 설정 | `theme.extend` 객체                       | `@theme { }` CSS 블록                  |
| 임포트    | `@tailwind base/components/utilities` 3줄 | `@import "tailwindcss"` 1줄            |
| 토큰 방식 | JS 객체 키                                | CSS 변수 네임스페이스 (`--color-*` 등) |

---

### 3-2. `@theme` 블록과 네임스페이스 규칙

`@theme` 블록 안에 CSS 변수를 선언하면 Tailwind가 변수 이름의 **네임스페이스**를 보고 어떤 유틸리티 클래스를 생성할지 결정한다.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-*      /* → bg-*, text-*, border-* 등 색상 유틸리티 */
  --font-*       /* → font-* 유틸리티 */
  --font-size-*  /* → text-* 유틸리티 */
  --spacing-*    /* → p-*, m-*, w-*, h-*, gap-* 등 */
  --breakpoint-* /* → sm:, md:, lg: 등 반응형 접두사 */
  --radius-*     /* → rounded-* 유틸리티 */
  --shadow-*     /* → shadow-* 유틸리티 */
}
```

기본값을 **완전히 초기화**하고 싶을 때는 와일드카드 리셋을 사용한다.

```css
@theme {
  --color-*: initial; /* 기본 색상 전체 제거 후 새로 정의 */
}
```

---

### 3-3. 색상 토큰 등록 및 사용

`globals.css`에 작성한 실제 색상 토큰:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* 주요 색상 */
  --color-flow-blue: #0052cc;
  --color-flow-purple: #6554c0;

  /* 보조 색상 */
  --color-flow-teal: #36b37e;

  /* 강조 색상 */
  --color-orange: #ff5630;
}
```

`--color-{이름}` 으로 등록하면 `bg-{이름}`, `text-{이름}`, `border-{이름}` 클래스가 자동 생성된다.

```tsx
<button className="bg-flow-blue text-white hover:bg-flow-purple">
  버튼
</button>

<span className="text-orange font-bold">강조 텍스트</span>

<div className="border-2 border-flow-teal">테두리</div>
```

#### 팔레트(shade) 구조

`--color-primary-500` 처럼 숫자를 포함한 이름으로 등록하면 shade 클래스가 만들어진다.

```css
@theme {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
}
```

```tsx
<div className="bg-primary-50 text-primary-900 border-primary-500">
```

---

### 3-4. 폰트 토큰 등록 및 사용

`globals.css`에 작성한 실제 폰트 토큰:

```css
@theme {
  /* 회사 폰트 */
  --font-noto-sans-kr: "Noto Sans KR", sans-serif;
}
```

`--font-{이름}` 으로 등록하면 `font-{이름}` 클래스가 자동 생성된다.

```tsx
<p className="font-noto-sans-kr">한국어 텍스트</p>
```

#### `next/font`와 연동

`next/font`가 주입하는 CSS 변수를 `@theme`에서 참조해 Tailwind 클래스로 노출할 수 있다.

```tsx
// app/layout.tsx
import { Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr", // @theme 변수 이름과 동일하게 맞춤
});

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body>{children}</body>
    </html>
  );
}
```

```css
/* app/globals.css */
@theme {
  /* next/font가 주입한 CSS 변수를 @theme에서 참조 */
  --font-noto-sans-kr: var(--font-noto-sans-kr), sans-serif;
}
```

---

### 3-5. 간격·크기 토큰 등록

`--spacing-*`을 등록하면 `p-*`, `m-*`, `w-*`, `h-*`, `gap-*` 등 간격 관련 유틸리티 전체에 적용된다.

```css
@theme {
  --spacing-18: 4.5rem; /* p-18, m-18, w-18 등으로 사용 */
  --spacing-128: 32rem;

  --radius-4xl: 2rem; /* rounded-4xl */

  --shadow-card: 0 4px 24px 0 rgb(0 0 0 / 0.08); /* shadow-card */

  /* clamp를 이용한 유동적 크기도 등록 가능 */
  --font-size-fluid-xl: clamp(1.5rem, 5vw, 3rem);
  --spacing-fluid-section: clamp(2rem, 8vw, 8rem);
}
```

```tsx
<div className="w-128 rounded-4xl shadow-card">카드</div>
<h1 className="text-fluid-xl">제목</h1>
<section className="py-fluid-section">섹션</section>
```

---

### 3-6. 다크모드와 `@theme` 연동

`@theme`에 등록된 CSS 변수는 `.dark` 스코프 안에서 값을 덮어쓰면 다크모드 전환 시 유틸리티 클래스가 자동으로 바뀐다.

```css
/* app/globals.css */
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme {
  --color-surface: #ffffff;
  --color-app-text: #111827;
}

.dark {
  --color-surface: #111827;
  --color-app-text: #f9fafb;
}
```

```tsx
{
  /* dark: 접두사 없이도 .dark 클래스 유무에 따라 자동 전환 */
}
<main className="bg-surface text-app-text">다크모드 자동 전환</main>;
```
