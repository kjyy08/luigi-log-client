# 병렬 리팩터링 에이전트 프롬프트 가이드

이 문서는 여러 AI 에이전트에게 동시다발적으로 리팩터링 작업을 지시하기 위한 프롬프트 템플릿과 전략을 제공합니다.

## 전략 (Strategy)

1.  **1 에이전트 = 1 작업 단위**: 한 에이전트에게 너무 많은 작업을 주지 마세요. `master_plan.md`의 한 체크박스 항목(또는 관련 항목 그룹)을 하나의 에이전트에게 할당하세요.
2.  **컨텍스트 주입**: 모든 에이전트는 프로젝트의 컨벤션과 아키텍처를 이해해야 합니다. 프롬프트 시작 부분에 핵심 규칙을 명시하거나, `docs/conventions.md`를 읽도록 지시하세요.
3.  **워크플로우 준수**: 에이전트가 임의로 행동하지 않고, 우리가 정한 `리팩터링 워크플로우`를 따르도록 강제하세요.

---

## 공통 프롬프트 템플릿 (Common Template)

모든 에이전트에게 공통적으로 제공해야 하는 서두입니다.

```markdown
당신은 현재 **Luigi Log** 프로젝트의 리팩터링을 담당하는 전문 수석 엔지니어 에이전트입니다.
이 프로젝트는 **React 19, TypeScript, Vite, FSD(Feature-Sliced Design)** 아키텍처를 따릅니다.

**필수 참조 문서**:
1. `docs/conventions.md` (코딩 컨벤션)
2. `docs/tech-spec.md` (기술 스펙)
3. `.agent/workflows/refactor_component.md` (리팩터링 워크플로우)

**당신의 임무**:
제공된 워크플로우(`refactor_component.md`)를 엄격히 준수하여 아래 **[할당된 작업]**을 수행하세요.
작업 수행 전 반드시 관련 문서를 읽고 컨텍스트를 파악해야 합니다.
작업이 끝난 후 `docs/refactoring/master_plan.md`에 체크를 해주세요.
리팩터링이 끝난 후 사용하지 않는 폴더, 파일은 모두 제거해주세요.
모든 문서 작업 및 사고 과정은 한글을 사용합니다.
```

---

## 바로 사용할 수 있는 작업별 프롬프트 (Ready-to-Use Prompts)

아래 프롬프트 블록을 그대로 복사하여 각 에이전트에게 전달하세요. **공통 템플릿 코드 블록 바로 아래에 붙여넣어서 사용하면 됩니다.**

### 1. Shared Layer

#### `shared/store` (Global State)
```markdown
**[할당된 작업]: Shared Store 리팩터링**
- **대상 경로**: `src/shared/store`
- **목표**:
  - Zustand 스토어 정의가 올바른지 확인 (`create`, `persist` 미들웨어 사용 등).
  - 스토어의 액션들이 불변성을 지키며 상태를 업데이트하는지 확인.
  - 타입 정의가 명확한지 확인.
  - 화살표 함수 사용 여부 확인.
```

### 2. Entities Layer

#### `entities/auth`
```markdown
**[할당된 작업]: Entity - Auth 리팩터링**
- **대상 경로**: `src/entities/auth`
- **목표**:
  - `api/`: Endpoint 정의 및 `publicApi` 사용 확인.
  - `model/`: DTO 타입 정의 및 Query Key Factory 패턴 적용 확인.
  - `config/`: 상수/Mock 데이터 분리 확인.
  - 모든 함수 화살표 함수 변환.
```

#### `entities/file`
```markdown
**[할당된 작업]: Entity - File 리팩터링**
- **대상 경로**: `src/entities/file`
- **목표**:
  - 파일 업로드 API 로직 점검.
  - 업로드 관련 Mutation Hook이 `model/`에 정의되어 있는지 확인.
  - 타입 안전성 및 에러 처리 확인.
```

#### `entities/member`
```markdown
**[할당된 작업]: Entity - Member 리팩터링**
- **대상 경로**: `src/entities/member`
- **목표**:
  - 멤버 정보 조회/수정 로직의 FSD 구조 준수 여부.
  - DTO와 실제 응답값의 일치 여부 확인.
  - 불필요한 코드 제거 및 스타일 가이드 준수.
```

#### `entities/post`
```markdown
**[할당된 작업]: Entity - Post 리팩터링**
- **대상 경로**: `src/entities/post`
- **목표**:
  - 블로그 포스트의 핵심 로직(목록 조회, 상세 조회 등) 구조화.
  - 캐싱 전략(Query Keys) 최적화.
  - 타입(Post, Tag 등) 정리.
```

#### `entities/profile`
```markdown
**[할당된 작업]: Entity - Profile 리팩터링**
- **대상 경로**: `src/entities/profile`
- **목표**:
  - 프로필 관련 데이터 fetching/update 로직 점검.
  - FSD 레이어 규칙 위반 사항 점검.
```

### 3. Features Layer

#### `features/auth`
```markdown
**[할당된 작업]: Feature - Auth (Login/Signup Form) 리팩터링**
- **대상 경로**: `src/features/auth`
- **목표**:
  - 로그인 및 회원가입 폼 로직의 UI/Business Logic 분리.
  - `react-hook-form` + `zod` 사용 패턴 검증.
  - `entities/auth`를 올바르게 import하여 사용하는지 확인.
```

#### `features/navigation`
```markdown
**[할당된 작업]: Feature - Navigation 리팩터링**
- **대상 경로**: `src/features/navigation`
- **목표**:
  - 헤더, 사이드바 등 내비게이션 컴포넌트 구조화.
  - 라우팅 관련 로직 점검.
```

### 4. Pages Layer

#### `pages/home`
```markdown
**[할당된 작업]: Page - Home 리팩터링**
- **대상 경로**: `src/pages/home`
- **목표**:
  - 홈 페이지 UI 컴포넌트 배치 및 스타일 점검.
  - 비즈니스 로직 최소화 (Features/Entities로 위임).
```

#### `pages/auth`
```markdown
**[할당된 작업]: Page - Auth Pages (Login, Rename, etc) 리팩터링**
- **대상 경로**: `src/pages/auth`, `src/pages/login` (폴더 통합 필요 시 수행)
- **목표**:
  - 로그인, 회원가입 페이지 UI 점검.
  - `features/auth`의 폼 컴포넌트 사용 확인.
```

#### `pages/post
```markdown
**[할당된 작업]: Page - Post 리팩터링**
- **대상 경로**: `src/pages/post`
- **목표**:
  - 목록 페이지 구현 점검.
  - 공통적인 목록 레이아웃 패턴 확인.
```

#### `pages/post-detail`
```markdown
**[할당된 작업]: Page - Post Detail 리팩터링**
- **대상 경로**: `src/pages/post-detail`, `src/pages/blog-detail`
- **목표**:
  - 포스트 상세 보기 페이지 UI 점검.
  - 마크다운 뷰어 등 하위 컴포넌트와의 연동 확인.
```

#### `pages/settings`
```markdown
**[할당된 작업]: Page - Settings 리팩터링**
- **대상 경로**: `src/pages/settings`
- **목표**:
  - 설정 및 프로필 편집 페이지 UI 점검.
  - `entities/member` 및 `entities/profile` 데이터 연동 확인.
```

#### `pages/admin`
```markdown
**[할당된 작업]: Page - Admin 리팩터링**
- **대상 경로**: `src/pages/admin`
- **목표**:
  - 관리자 대시보드 구조 점검.
  - 데이터 관리 기능(테이블 등) UI 점검.
```

---

## 실행 전 체크리스트 (User용)

에이전트에게 명령을 내리기 전에 확인하세요:
- [ ] 에이전트가 `active workspace`에 접근 권한이 있는가?
- [ ] `docs/` 폴더의 문서들이 최신 상태인가?
- [ ] 다른 에이전트와 수정하는 파일이 겹치지 않는가? (가능한 파일 충돌 방지)
