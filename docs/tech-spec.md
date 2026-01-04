# Luigi Log Frontend

React + TypeScript + Vite 기반의 프론트엔드 프로젝트입니다.

## 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구 (SWC 플러그인 사용)
- **TanStack Query** - 서버 상태 관리 (캐싱 자동)
- **Zustand** - 전역 상태 관리 (유저 정보, 테마 등)
- **React Router** - 라우팅
- **Tailwind CSS** - 스타일링
- **shadcn/ui** - 헤드리스 UI
- **react-hook-form + zod** - 폼 & 유효성 검증
- **swagger-typescript-api** - Swagger to TypeScript 코드 생성
- **Biome** - 린팅 및 포매팅
- **pnpm** - 패키지 매니저

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- pnpm 8 이상

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

## 아키텍처

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다.

### 레이어 계층 구조

```
app > pages > features > entities > shared
```

- **상위 레이어는 하위 레이어를 import 할 수 있음**
- **하위 레이어는 상위 레이어를 import 할 수 없음**
- **같은 레이어의 slice 간 import 금지**

### 프로젝트 구조

```
src/
├── app/                  # 앱 동작에 필수적인 설정 (main.tsx 포함)
│   ├── main.tsx          # 엔트리 포인트
│   ├── mocks/            # MSW 설정
│   ├── routes/           # Router 설정
│   └── styles/           # 전역 스타일
│
├── pages/                # 페이지 UI 컴포넌트
│   └── [page-name]/
│       └── ui/           # UI 컴포넌트만
│
├── features/             # pages 간 공유 UI (선택적 사용)
│   └── [feature-name]/
│       └── ui/           # 공유 UI 컴포넌트
│
├── entities/             # 데이터 원형 및 서버 호출
│   └── [entity]/
│       ├── api/          # API 호출 함수, mock handlers
│       ├── config/       # mock data, 상수
│       └── model/        # 타입 정의 (DTO), query factory
│
└── shared/               # 전역 공유 리소스
    ├── lib/              # API 클라이언트 (axios), 유틸리티
    ├── ui/               # 공통 UI 컴포넌트
    ├── config/           # 환경 설정
    ├── type/             # 공통 타입
    └── store/            # 전역 상태 (Zustand)
```

### Segments 규칙

- `pages`, `features`, `entities` 레이어: `ui`, `api`, `model`, `lib`, `config` 만 사용
- `app`, `shared` 레이어: 커스텀 segment 허용
- `src/` 폴더에 레이어 외 별도 파일 금지

## 상태 관리 전략

1. **서버 데이터**: TanStack Query (캐싱 자동)
2. **전역 상태** (유저 정보, 테마 등): Zustand
3. **폼**: React Hook Form + Zod
4. **로컬 UI 상태**: useState

## 클라이언트 기본 설정

- axios/fetch 인스턴스 생성
- baseURL, timeout 설정
- 인터셉터 (토큰 자동 추가, 에러 처리)
- TanStack Query 기본 설정 (QueryClient, defaultOptions)

더 자세한 컨벤션은 [conventions.md](conventions.md)를 참조하세요.