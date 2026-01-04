# 리팩터링 마스터 플랜

이 문서는 Luigi Log 프로젝트의 병렬 리팩터링 작업을 개략적으로 설명합니다. 여러 에이전트가 이 목록에서 항목을 선택하여 작업을 수행할 수 있습니다.

## 1. Shared 레이어 리팩터링
- [x] **`shared/ui`**: 공통 UI 컴포넌트 리팩터링 (shadcn/ui 수정). Variants가 올바르게 사용되는지 확인.
- [x] **`shared/lib` & `shared/config`**: 절대 경로 import 및 올바른 export 패턴 확인.
- [x] **`shared/providers`**: ThemeProvider 등 전역 Provider 위치 리팩터링 완료.
- [x] **`shared/store`**: Zustand 로직 검증.

## 2. Entities 레이어 리팩터링
*독립적인 작업입니다. 병렬로 수행 가능합니다.*

- [x] **`entities/auth`**: API, Model, Store 리팩터링. 엔드포인트 검증.
- [x] **`entities/file`**: 파일 업로드 로직 리팩터링.
- [x] **`entities/member`**: 멤버 데이터 처리 리팩터링.
- [x] **`entities/post`**: 포스트 조회, 캐싱, 타입 리팩터링.
- [x] **`entities/profile`**: 프로필 관리 리팩터링.

## 3. Features 레이어 리팩터링
- [x] **`features/auth`**: 로그인/회원가입 폼 로직 (OAuth 사용, UI/Logic 분리 완료).
- [x] **`features/navigation`**: 내비게이션 컴포넌트.
- [x] **`features/post-editor`**: 마크다운 에디터 로직 및 미리보기. 비즈니스 로직 분리(`useEditorActions`) 및 FSD 위반 수정 완료.

## 4. Pages 레이어 리팩터링
*독립적인 작업입니다. 병렬로 수행 가능합니다.*

- [x] **`pages/home`**: 홈 페이지 UI 리팩터링 완료 (Aesthetics 강화, FSD 준수).
- [x] **`pages/auth` (Login/Signup)**: 인증 페이지 리팩터링 완료 (OAuthCallbackPage 구조화 및 UI 개선).
- [x] **`pages/post`**, **`pages/blog`**, **`pages/portfolio`**: 목록 페이지 리팩터링 완료. 공통 레이아웃 및 `PostList` 기능 분리.
- [ ] **`pages/post-detail`**: 포스트 읽기 경험 리팩터링.
- [ ] **`pages/settings`**: 설정/프로필 편집 페이지 리팩터링.
- [ ] **`pages/admin`**: 관리자 대시보드 리팩터링.

## 체크포인트 기준
각 작업에 대해:
1. **FSD 아키텍처** 준수 (올바른 레이어/세그먼트).
2. **네이밍 컨벤션** 준수 (파일: hyphen-case, 컴포넌트: PascalCase).
3. 모든 곳에 **화살표 함수 (Arrow Functions)** 사용.
4. **TanStack Query** 올바른 사용 (model 내부의 Query Key Factory 패턴).
5. `pnpm lint` 통과.
