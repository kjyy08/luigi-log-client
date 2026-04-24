# luigi-log-client AGENTS.md

## 프로젝트

- repo: `kjyy08/luigi-log-client`
- 역할: luigi-log 블로그 프론트엔드
- stack: React 19, TypeScript, Vite/Rolldown, Tailwind CSS, React Router, TanStack Query, Zustand

## 주요 경로

```txt
src/       # 애플리케이션 코드
public/    # 정적 파일
docs/      # 문서
```

## 명령

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
npm run preview      # 빌드 결과 preview
```

## 작업 규칙

- 작업은 항상 이 repo 루트(`.../luigi-log/client`)에서 한다.
- UI 변경 시 반응형, 접근성, 로딩/에러 상태를 같이 본다.
- 서버 API 계약이 바뀌면 `server` 변경사항과 맞춰 확인한다.
- 패키지 매니저 lockfile이 `package-lock.json`, `pnpm-lock.yaml` 둘 다 있으므로, 의존성 변경 전 어떤 매니저를 쓸지 확인한다. 기본 검증은 `npm` 스크립트 기준으로 한다.
- 불필요한 대규모 포맷팅이나 파일 이동은 하지 않는다.

## 검증 기준

- 일반 변경: `npm run lint`
- 빌드 영향 변경: `npm run build`
- API 연동 변경: 관련 화면의 로딩/성공/실패 상태를 확인한다.

## 보고 형식

```txt
변경 repo: client
변경 요약:
- ...
검증:
- npm run lint: PASS/FAIL
- npm run build: PASS/FAIL/미실행(사유)
리스크:
- ...
```
