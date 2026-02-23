# 2026-02-23 학습 내용 정리

## 목차

1. [아토믹 디자인 (Atomic Design)](#1-아토믹-디자인-atomic-design)
   - [Atoms (원자)](#1-atoms-원자)
   - [Molecules (분자)](#2-molecules-분자)
   - [Organisms (유기체)](#3-organisms-유기체)
   - [Templates (템플릿)](#4-templates-템플릿)
   - [Pages (페이지)](#5-pages-페이지)
2. [합성 컴포넌트 패턴 (Compound Component)](#2-합성-컴포넌트-패턴-compound-component)
3. [웹 접근성 (Web Accessibility)](#3-웹-접근성-web-accessibility)
   - [의미 있는 HTML 구조와 시맨틱 마크업](#1-의미-있는-html-구조와-시맨틱-마크업)
   - [키보드 내비게이션 지원](#2-키보드-내비게이션-지원)
   - [이미지와 대체 텍스트 (Alt Text)](#3-이미지와-대체-텍스트-alt-text)
   - [ARIA 속성과 동적 콘텐츠 관리](#4-aria-속성과-동적-콘텐츠-관리)
   - [Metadata를 활용한 접근성 최적화](#5-metadata를-활용한-접근성-최적화)

---

## 1. 아토믹 디자인 (Atomic Design)

아토믹 디자인은 UI를 화학의 원자 개념에서 착안하여 계층적으로 분해하는 디자인 방법론이다.
UI 컴포넌트를 가장 작은 단위부터 시작해 점진적으로 조합해 나가는 방식으로 구성한다.

### 아토믹 디자인의 5가지 단계

#### 1. Atoms (원자)

더 이상 분해할 수 없는 가장 기본적인 UI 요소.

| 예시       | 설명                 |
| ---------- | -------------------- |
| `<Button>` | 클릭 가능한 버튼     |
| `<Input>`  | 텍스트 입력 필드     |
| `<Label>`  | 텍스트 레이블        |
| `<Icon>`   | 아이콘 이미지        |
| `<Avatar>` | 사용자 프로필 이미지 |

```tsx
// 예시: Button Atom
function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick}>{label}</button>;
}
```

---

#### 2. Molecules (분자)

여러 원자를 결합하여 하나의 기능 단위를 이루는 컴포넌트.

| 예시        | 구성 원자              |
| ----------- | ---------------------- |
| 검색 폼     | `<Input>` + `<Button>` |
| 폼 필드     | `<Label>` + `<Input>`  |
| 프로필 카드 | `<Avatar>` + `<Label>` |

```tsx
// 예시: SearchForm Molecule
function SearchForm() {
  return (
    <div>
      <Input placeholder="검색어 입력" />
      <Button label="검색" onClick={() => {}} />
    </div>
  );
}
```

---

#### 3. Organisms (유기체)

분자들의 조합으로 만든 복잡한 UI 섹션. 독립적으로 의미 있는 영역을 구성한다.

| 예시      | 구성 분자/원자                     |
| --------- | ---------------------------------- |
| 헤더      | 로고 + 네비게이션 메뉴 + 검색 폼   |
| 푸터      | 링크 목록 + 저작권 텍스트          |
| 댓글 섹션 | 프로필 카드 + 텍스트 + 좋아요 버튼 |

```tsx
// 예시: Header Organism
function Header() {
  return (
    <header>
      <Logo />
      <Nav />
      <SearchForm />
    </header>
  );
}
```

---

#### 4. Templates (템플릿)

실제 콘텐츠 없이 페이지의 레이아웃 구조(와이어프레임)를 정의한다.

| 예시              | 설명                                   |
| ----------------- | -------------------------------------- |
| BlogTemplate      | 헤더 + 사이드바 + 본문 영역의 레이아웃 |
| DashboardTemplate | 상단 바 + 좌측 메뉴 + 콘텐츠 영역      |

```tsx
// 예시: BlogTemplate
function BlogTemplate({ header, sidebar, content }: Props) {
  return (
    <div>
      {header}
      <main>
        <aside>{sidebar}</aside>
        <article>{content}</article>
      </main>
    </div>
  );
}
```

---

#### 5. Pages (페이지)

템플릿에 실제 데이터(콘텐츠)를 채워 넣은 최종 UI.

| 예시           | 설명                                               |
| -------------- | -------------------------------------------------- |
| HomePage       | 메인 배너, 추천 게시글 목록 등 실제 데이터 포함    |
| BlogDetailPage | 특정 게시글의 제목, 본문, 댓글 등 실제 콘텐츠 포함 |

```tsx
// 예시: BlogDetailPage
function BlogDetailPage() {
  const post = useFetchPost(id);
  return (
    <BlogTemplate
      header={<Header />}
      sidebar={<RecentPosts />}
      content={<PostContent post={post} />}
    />
  );
}
```

---

### 아토믹 디자인의 장점

| 장점              | 설명                                                               |
| ----------------- | ------------------------------------------------------------------ |
| **재사용성**      | 원자 단위로 분리된 컴포넌트를 여러 곳에서 재사용 가능              |
| **일관성**        | 같은 컴포넌트를 사용하므로 UI의 일관성이 자연스럽게 유지됨         |
| **유지보수 용이** | 특정 컴포넌트 수정 시 해당 컴포넌트를 사용하는 모든 곳에 자동 반영 |
| **협업 효율**     | 디자이너와 개발자가 같은 언어(컴포넌트 단위)로 소통 가능           |
| **테스트 용이**   | 작은 단위로 분리되어 있어 단위 테스트 작성이 쉬움                  |

### 아토믹 디자인의 문제점

| 문제점                 | 설명                                                                         |
| ---------------------- | ---------------------------------------------------------------------------- |
| **단계 구분의 모호함** | 어떤 컴포넌트를 Molecule로 볼지 Organism으로 볼지 팀마다 기준이 다를 수 있음 |
| **과도한 분리**        | 지나치게 잘게 쪼개면 오히려 파일이 많아지고 복잡도가 증가할 수 있음          |

---

## 2. 합성 컴포넌트 패턴 (Compound Component)

합성 컴포넌트 패턴은 여러 개의 작은 컴포넌트들을 조합하여 하나의 완성된 컴포넌트를 만드는 디자인 패턴이다.
컴포넌트의 **구조와 스타일을 재사용 가능한 작은 단위로 분리**하면서도, **각 부분을 자유롭게 조합**할 수 있는 **유연성을 제공**한다.

> 하나의 컴포넌트(모달, 드롭박스 등)의 구조도 자유롭게 조합할 수 있게 만들어준다.

### 모달(Modal) 합성 컴포넌트 예시

일반적인 모달은 `props`로 제목, 내용, 버튼을 모두 전달받아 고정된 구조를 가진다.
합성 컴포넌트 패턴을 적용하면, 사용하는 쪽에서 구조를 자유롭게 결정할 수 있다.

#### 컴포넌트 구성

```tsx
// Modal.tsx - 합성 컴포넌트 정의

import { createContext, useContext, ReactNode } from "react";

// 1. Context 생성 (내부 상태 공유용)
const ModalContext = createContext<{ onClose: () => void } | null>(null);

function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal 컴포넌트 안에서만 사용할 수 있습니다.");
  return ctx;
}

// 2. 루트 컴포넌트 - Context Provider 역할 (배경 + 전체 감싸기)
function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-backdrop">
        <div className="modal">{children}</div>
      </div>
    </ModalContext.Provider>
  );
}

// 3. 서브 컴포넌트들 정의

// 모달 내부 콘텐츠 영역 전체를 감싸는 컨테이너
Modal.Content = function ModalContent({ children }: { children: ReactNode }) {
  return <div className="modal-content">{children}</div>;
};

// 제목 + 닫기 버튼을 담는 상단 영역
Modal.Header = function ModalHeader({ children }: { children: ReactNode }) {
  return <div className="modal-header">{children}</div>;
};

// 모달 제목 텍스트
Modal.Title = function ModalTitle({ children }: { children: ReactNode }) {
  return <h2 className="modal-title">{children}</h2>;
};

// 모달 본문 설명 텍스트
Modal.Description = function ModalDescription({
  children,
}: {
  children: ReactNode;
}) {
  return <p className="modal-description">{children}</p>;
};

// 하단 버튼 영역
Modal.Footer = function ModalFooter({ children }: { children: ReactNode }) {
  return <div className="modal-footer">{children}</div>;
};

// Context에서 onClose를 꺼내 사용하는 닫기 버튼
Modal.CloseButton = function ModalCloseButton() {
  const { onClose } = useModalContext();
  return <button onClick={onClose}>✕</button>;
};

export default Modal;
```

#### 사용 예시

```tsx
// 사용하는 쪽에서 구조를 자유롭게 조합
function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>모달 열기</button>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>회원가입 완료</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>
            <Modal.Description>
              가입이 성공적으로 완료되었습니다. 이제 서비스를 이용하실 수
              있습니다.
            </Modal.Description>
            <Modal.Footer>
              <button onClick={() => setIsOpen(false)}>확인</button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      )}
    </>
  );
}
```

#### 패턴의 핵심 구조

| 구성 요소           | 역할                                          |
| ------------------- | --------------------------------------------- |
| `Modal` (루트)      | Context Provider, 배경 오버레이 + 전체 감싸기 |
| `Modal.Content`     | 모달 내부 콘텐츠 전체를 감싸는 컨테이너       |
| `Modal.Header`      | 제목과 닫기 버튼을 담는 상단 영역             |
| `Modal.Title`       | 모달 제목 텍스트                              |
| `Modal.Description` | 모달 본문 설명 텍스트                         |
| `Modal.Footer`      | 하단 버튼 영역                                |
| `Modal.CloseButton` | Context에서 `onClose`를 꺼내 사용             |

### 정리

합성 컴포넌트 패턴은 **"하나의 컴포넌트를 여러 서브 컴포넌트로 분리하고, 사용하는 쪽에서 자유롭게 조합"** 하는 패턴이다.

- **기존 방식**: `<Modal title="..." description="..." footer="..." />` → props가 늘어날수록 복잡해짐
- **합성 컴포넌트**: `<Modal>`, `<Modal.Content>`, `<Modal.Title>`, `<Modal.Description>`, `<Modal.Footer>` → 사용하는 쪽에서 구조 결정

| 장점               | 설명                                            |
| ------------------ | ----------------------------------------------- |
| **유연성**         | 사용하는 곳마다 구조를 다르게 조합 가능         |
| **가독성**         | JSX만 봐도 컴포넌트의 구조가 한눈에 보임        |
| **props 간소화**   | 수십 개의 props 대신 구조로 표현                |
| **내부 상태 공유** | Context를 통해 서브 컴포넌트끼리 상태 공유 가능 |

---

## 3. 웹 접근성 (Web Accessibility)

웹 접근성이란 장애 여부, 환경, 기기에 관계없이 모든 사용자가 웹 콘텐츠를 동등하게 이용할 수 있도록 보장하는 것이다.

### 1. 의미 있는 HTML 구조와 시맨틱 마크업

HTML 태그를 의미에 맞게 사용하면 스크린 리더가 페이지 구조를 올바르게 해석할 수 있다.

```html
<!-- 나쁜 예: div만 사용 -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="main">...</div>

<!-- 좋은 예: 시맨틱 태그 사용 -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<footer>...</footer>
```

| 태그        | 의미                          |
| ----------- | ----------------------------- |
| `<header>`  | 페이지 또는 섹션의 머리글     |
| `<nav>`     | 내비게이션 링크 모음          |
| `<main>`    | 페이지의 핵심 콘텐츠          |
| `<article>` | 독립적으로 완결된 콘텐츠      |
| `<section>` | 주제별로 묶인 콘텐츠 영역     |
| `<aside>`   | 부가적인 콘텐츠 (사이드바 등) |
| `<footer>`  | 페이지 또는 섹션의 바닥글     |

---

### 2. 키보드 내비게이션 지원

마우스를 사용하지 못하는 사용자를 위해 키보드만으로 모든 기능을 이용할 수 있어야 한다.

- `Tab` 키로 포커스 이동, `Enter` / `Space`로 실행
- `tabIndex`로 포커스 순서 제어 (`tabIndex={0}`: 일반 탭 순서, `tabIndex={-1}`: 탭 제외)
- 포커스가 보이도록 `:focus` CSS 스타일 유지 (`outline: none` 남용 금지)

```tsx
// 키보드 이벤트 지원 예시
function CustomButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      클릭하세요
    </div>
  );
}
```

---

### 3. 이미지와 대체 텍스트 (Alt Text)

스크린 리더는 이미지를 볼 수 없으므로 `alt` 속성으로 이미지의 의미를 전달해야 한다.

```html
<!-- 의미 있는 이미지: 내용을 설명하는 alt 제공 -->
<img src="logo.png" alt="회사 로고" />

<!-- 장식용 이미지: alt를 빈 문자열로 설정 (스크린 리더가 무시함) -->
<img src="decoration.png" alt="" />
```

| 상황             | alt 작성 방법               |
| ---------------- | --------------------------- |
| 의미 있는 이미지 | 이미지 내용을 간결하게 설명 |
| 장식용 이미지    | `alt=""` (빈 문자열)        |
| 링크 안의 이미지 | 링크 목적지를 설명          |
| 버튼 안의 이미지 | 버튼의 기능을 설명          |

---

### 4. ARIA 속성과 동적 콘텐츠 관리

ARIA(Accessible Rich Internet Applications)는 HTML만으로 표현하기 어려운 UI의 역할, 상태, 관계를 보조 기술에 전달하는 속성이다.

#### ARIA 속성 목록

| aria 속성          | 설명                                       | 사용 시기 예시                                            |
| ------------------ | ------------------------------------------ | --------------------------------------------------------- |
| `role`             | 요소의 역할을 명시                         | `<div role="button">`, `<div role="dialog">`              |
| `aria-label`       | 요소에 텍스트 레이블 직접 지정             | 아이콘 버튼처럼 텍스트가 없는 요소에 이름 부여            |
| `aria-labelledby`  | 다른 요소의 ID를 참조해 레이블로 사용      | 모달 제목(`<h2 id="modal-title">`)을 모달의 레이블로 연결 |
| `aria-describedby` | 요소를 추가로 설명하는 다른 요소의 ID 참조 | 입력 필드 아래 오류 메시지나 도움말을 설명으로 연결       |
| `aria-modal`       | 요소가 모달 대화상자임을 명시              | 모달이 열렸을 때 배경 콘텐츠 접근 차단                    |
| `aria-hidden`      | 요소를 보조 기술에서 숨김                  | 장식용 아이콘, 중복 텍스트 등 스크린 리더에서 제외        |
| `aria-live`        | 동적으로 변경되는 콘텐츠를 알림            | 알림 메시지, 검색 결과 업데이트 등 실시간 변경 영역       |
| `aria-expanded`    | 요소(드롭다운 등)의 펼침/접힘 상태 표시    | 아코디언, 드롭다운 메뉴의 열림/닫힘 상태                  |
| `aria-controls`    | 이 요소가 제어하는 다른 요소의 ID 참조     | 버튼이 어떤 패널을 열고 닫는지 연결                       |
| `aria-current`     | 현재 활성화된 항목 표시                    | 내비게이션에서 현재 페이지 링크에 `aria-current="page"`   |
| `aria-disabled`    | 요소가 비활성 상태임을 명시                | 제출 버튼이 비활성화 상태일 때                            |
| `aria-required`    | 필수 입력 필드임을 명시                    | 폼에서 반드시 입력해야 하는 필드                          |
| `aria-checked`     | 체크박스/라디오의 체크 상태 표시           | 커스텀 체크박스의 선택 여부 전달                          |

```tsx
// ARIA 속성 사용 예시: 접근 가능한 모달
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
>
  <h2 id="modal-title">회원가입 완료</h2>
  <p id="modal-desc">가입이 성공적으로 완료되었습니다.</p>
  <button aria-label="모달 닫기" onClick={onClose}>
    ✕
  </button>
</div>;

{
  /* 실시간 알림 영역 */
}
<div aria-live="polite">{message}</div>;
```

---

### 5. Metadata를 활용한 접근성 최적화

페이지의 메타데이터(`<title>`, `<meta description>` 등)는 스크린 리더가 페이지를 설명하거나,
검색 결과에서 페이지를 식별하는 데 중요한 역할을 한다.

#### Next.js `generateMetadata` 사용 예시

```tsx
// app/posts/[id]/page.tsx

import { cache } from "react";

// cache()로 감싸면 같은 렌더링 사이클에서 동일한 인자로 호출 시
// API 요청을 1번만 실행하고 결과를 재사용한다
const getPost = cache(async (id: string) => {
  const res = await fetch(`https://api.example.com/posts/${id}`);
  return res.json();
});

// generateMetadata와 Page 컴포넌트가 각각 getPost를 호출하더라도
// cache() 덕분에 실제 API 요청은 1번만 발생한다
export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPost(params.id); // API 호출 (1번째 → 실제 요청 발생)

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.thumbnail],
    },
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id); // API 호출 (2번째 → 캐시에서 반환, 실제 요청 없음)

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
    </article>
  );
}
```

#### 동작 원리

```
렌더링 사이클 시작
├── generateMetadata() 실행
│   └── getPost("123") 호출 → 실제 API 요청 발생 → 결과 캐시에 저장
└── PostPage() 실행
    └── getPost("123") 호출 → 캐시에서 반환 (API 요청 없음)

결과: API 요청 1번으로 메타데이터 + 페이지 데이터 모두 처리
```

| 항목               | 설명                                                         |
| ------------------ | ------------------------------------------------------------ |
| `cache()`          | React의 서버 사이드 캐싱 함수, 동일 인자 호출 시 결과 재사용 |
| `generateMetadata` | Next.js App Router에서 동적으로 메타데이터를 생성하는 함수   |
| 캐시 범위          | 동일한 렌더링 사이클(요청) 내에서만 유효 (요청마다 초기화)   |
