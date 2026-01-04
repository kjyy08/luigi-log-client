---
description: 컴포넌트 또는 모듈을 FSD 및 코드 컨벤션에 맞게 리팩터링
---
# 리팩터링 워크플로우

이 워크플로우는 특정 컴포넌트, 엔티티 또는 기능을 프로젝트의 FSD(Feature-Sliced Design) 아키텍처 및 코딩 컨벤션에 맞게 리팩터링하는 과정을 안내합니다.

**전제 조건**:
- 시작 전 **대상 경로** (예: `src/entities/user`)를 식별해야 합니다.
- `docs/conventions.md` 및 `docs/tech-spec.md`를 반드시 읽어야 합니다.

## 1. 분석 (Analysis)

1.  **파일 목록 확인**: 대상 경로의 모든 파일을 나열하여 구조를 파악합니다.
    ```bash
    ls -R [대상 경로]
    ```
    *(Use `list_dir` tool)*

2.  **코드 읽기**: 주요 파일(진입점, 모델, UI 컴포넌트)을 읽습니다.
    *(Use `view_file` tool)*

3.  **위반 사항 식별**:
    - **FSD 위반**:
        - 상위 레이어에서의 import가 있는가? (예: `entities`가 `features`를 import)
        - 같은 레이어의 슬라이스 간 교차 import가 있는가?
        - 파일이 올바른 세그먼트(`ui`, `model`, `api`, `config`, `lib`)에 위치하는가?
    - **네이밍 위반**:
        - 파일/폴더명: `hyphen-case`?
        - 컴포넌트명: `PascalCase`?
        - 함수명: `camelCase`?
        - 상수: `UPPER_SNAKE_CASE`?
    - **코드 스타일 위반**:
        - 함수가 **화살표 구문 (Arrow Syntax)**을 사용하는가?
        - 타입이 `interface` (객체) 또는 `type` (유니온)으로 올바르게 정의되었는가?
        - `publicApi`가 올바르게 사용되었는가?
        - import 정렬이 올바른가?

## 2. 리팩터링 (Refactoring)

식별된 각 위반 사항에 대해 수정 사항을 적용합니다.

### A. 구조 및 네이밍
- 파일/폴더명을 `hyphen-case`로 변경합니다.
- 파일을 적절한 세그먼트(`ui`, `model`, `api` 등)로 이동합니다.

### B. 코드 스타일 및 로직
- 함수 선언을 화살표 함수(Arrow Functions)로 변환합니다.
- import 경로를 수정합니다 (가능한 경우 절대 경로 `@/...` 사용).
- `useQuery` / `useMutation` 로직이 `model` 훅 내에 캡슐화되어 있는지 확인합니다.

## 3. 검증 (Verification)

1.  **린트 (Lint)**: 특정 파일 또는 디렉토리에 대해 린터를 실행하거나(가능한 경우), 전역으로 실행하여 회귀를 확인합니다.
    ```bash
    pnpm lint
    ```
    *(Use `run_command`)*

2.  **빌드 확인 (Build Check)**: 변경 사항이 문제를 일으키지 않는지 확인하기 위해 빌드를 실행합니다.
    ```bash
    pnpm build
    ```
    *(exports에 영향을 주는 중요한 변경을 한 경우에만 실행)*

3.  **수동 검토**: 변경 사항을 `docs/conventions.md`와 대조하여 다시 확인합니다.

## 4. 마무리 (Finalization)

- 변경 사항 요약을 작성합니다.
- 새로운 아티팩트를 생성했다면 이를 언급합니다.
