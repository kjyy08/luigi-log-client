# Contributing Guide

Frontend 프로젝트에 기여하는 방법을 안내합니다.

## 컨벤션

### 네이밍 컨벤션

- **폴더**: `hyphen-case` (예: `create-user`, `user-list`)
- **컴포넌트 파일**: `hyphen-case` (예: `user-list.tsx`)

### 코드 스타일

- `any` 타입 사용 지양
- React Hook 의존성 배열 완전성 체크

### 코드 작성 컨벤션

#### 변수명

- **camelCase**: 일반 변수, 함수명, 파라미터

  ```typescript
  const userName = "John";
  const fetchUsers = async () => { ... };
  function handleClick(event: MouseEvent) { ... }
  ```

- **PascalCase**: 컴포넌트, 타입, 인터페이스, 클래스

  ```typescript
  interface User { ... }
  type UserRole = "admin" | "user";
  const UserList = () => { ... };
  class QueryClient { ... }
  ```

- **UPPER_SNAKE_CASE**: 상수
  ```typescript
  const API_BASE_URL = "https://api.example.com";
  const MAX_RETRY_COUNT = 3;
  ```

#### 함수 작성

**함수 선언 방식**:

- 모든 함수: **Arrow Function** 사용
- React 컴포넌트: `export const ComponentName = () => { ... }`
- Custom Hook: `export const useHookName = () => { ... }`

**명명 규칙**:

- 컴포넌트: 명사형 PascalCase (예: `UserList`, `UserCard`)
- 일반 함수: 동사+명사 camelCase (예: `fetchUsers`, `createUser`)
- Hook 함수: `use` 접두사 + camelCase (예: `useUsers`, `useCreateUser`)
- 이벤트 핸들러: `handle` 접두사 + camelCase (예: `handleClick`, `handleSubmit`)

**예시**:

```typescript
// ✅ 일반 함수 - Arrow Function
const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>("/users");
  return data;
};

// ✅ 컴포넌트 - Arrow Function
export const UserList = () => {
  return <div>...</div>;
};

// ✅ Custom Hook - Arrow Function
export const useUsers = (filters?: Record<string, unknown>) => {
  return useSuspenseQuery(userQueries.list(filters));
};

// ✅ 이벤트 핸들러 - Arrow Function
const onSubmit = (event: FormEvent) => {
  event.preventDefault();
  // ...
};
```

#### 타입 정의

**Interface vs Type**:

- 객체 형태의 타입: `interface` 사용
- Union, Intersection, Primitive: `type` 사용

```typescript
// ✅ Interface 사용
interface User {
  id: number;
  name: string;
  email: string;
}

interface QueryProviderProps {
  children: ReactNode;
}

// ✅ Type 사용
type UserRole = "admin" | "user" | "guest";
type CreateUserInput = Omit<User, "id">;
```

#### React Query 패턴

**Query 작성**:

```typescript
// Query 키 팩토리 패턴
export const userQueries = {
  all: () => ["users"],
  lists: () => [...userQueries.all(), "list"],
  list: (filters?: Record<string, unknown>) =>
    queryOptions({
      queryKey: [...userQueries.lists(), filters],
      queryFn: fetchUsers,
    }),
  details: () => [...userQueries.all(), "detail"],
  detail: (id: number) =>
    queryOptions({
      queryKey: [...userQueries.details(), id],
      queryFn: () => fetchUser(id),
    }),
};

// Hook도 Arrow Function
export const useUsers = (filters?: Record<string, unknown>) => {
  return useSuspenseQuery(userQueries.list(filters));
};
```

**Mutation 작성**:

```typescript
// 일반 함수는 Arrow Function
const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  const { data } = await api.post<User>("/users", userData);
  return data;
};

// Hook도 Arrow Function
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueries.lists() });
    },
  });
};
```

#### 컴포넌트 작성

**구조**:

```typescript
// 1. Import (외부 라이브러리 → 내부 모듈 → 타입)
import { useState } from "react";
import { useUsers } from "../../api";
import type { User } from "../../model/types";

// 2. 컴포넌트
export const UserList = () => {
  // 3. Hooks
  const { data: users } = useUsers();
  const [selected, setSelected] = useState<User | null>(null);

  // 4. 이벤트 핸들러
  const handleSelect = (user: User) => {
    setSelected(user);
  };

  // 5. JSX 반환 (Tailwind CSS 클래스 사용)
  return (
    <div className="flex flex-col gap-2 p-4">
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => handleSelect(user)}
          className="cursor-pointer rounded-md p-2 hover:bg-gray-100"
        >
          {user.name}
        </div>
      ))}
    </div>
  );
};
```

**Props 타입**:

```typescript
// ✅ Interface 사용
interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
}

export const UserCard = ({ user, onSelect }: UserCardProps) => {
  return <div onClick={() => onSelect?.(user)}>{user.name}</div>;
};
```

#### Import 정렬

```typescript
// 1. React 및 외부 라이브러리
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// 2. 절대 경로 import (@로 시작)
import { publicApi } from "@/shared/lib/api-client";
import type { User } from "@/entities/user";

// 3. 상대 경로 import
import { useUsers } from "../../api";
```

### 커밋 컨벤션

커밋 메시지는 [Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다:

```
<type>: <description>
```

**Type 종류**:

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 리팩토링
- `perf`: 성능 개선
- `test`: 테스트 추가/수정
- `chore`: 빌드, 패키지 매니저 설정 등
- `ci`: CI 설정
- `build`: 빌드 시스템 변경

**예시**:

```bash
feat: 사용자 프로필 페이지 추가
fix: 로그인 버튼 클릭 오류 수정
docs: README 업데이트
refactor: 사용자 API 구조 개선
chore: React Query 버전 업데이트
```

## Feature-Sliced Design (FSD)

### 레이어 계층

```
app > pages > features > entities > shared
```

- **상위 레이어 → 하위 레이어 import 가능**
- **하위 레이어 → 상위 레이어 import 불가**
- **같은 레이어의 slice 간 import 금지**

### 레이어별 역할

| 레이어       | 역할                              | Segments                    |
| ------------ | --------------------------------- | --------------------------- |
| **app**      | 앱 동작 필수 설정 (main.tsx 포함) | 커스텀 허용                 |
| **pages**    | 페이지 컴포넌트 및 비즈니스 로직  | ui, model, api, lib, config |
| **features** | pages 간 공유 UI (선택적)         | ui, model, api, lib, config |
| **entities** | 데이터 원형 및 서버 호출          | ui, model, api, lib, config |
| **shared**   | 전역 공유 리소스                  | 커스텀 허용                 |

### 레이어 상세

**App** (`app/`):

- `main.tsx`: 엔트리 포인트
- `providers/`: QueryClient, Router 등
- `styles/`: 전역 스타일

**Pages** (`pages/[page-name]/`):

- `ui/`: 페이지 UI 컴포넌트만

**Features** (`features/[feature-name]/`):

- pages의 slice 간 UI 공유가 필요한 경우에만 사용
- 최근 추세는 pages 도메인 기반 설계로, features는 선택적

**Entities** (`entities/[entity]/`):

- `api/`: API 호출 함수, mock handlers
- `config/`: mock data, 상수
- `model/`: 타입 정의 (DTO), query factory

**Shared** (`shared/`):

- `lib/`: API 클라이언트 (axios), 유틸리티 - **publicApi는 여기서만 export**
- `ui/`: 공통 UI 컴포넌트
- `config/`: 환경 설정
- `type/`: 공통 타입 (ResponseDTO 등)
- `store/`: 전역 상태 (Zustand)

### 중요 규칙

- `src/` 폴더에 레이어 외 별도 파일 금지
- `pages`, `features`, `entities`는 정해진 segments만 사용
- hook은 `model/`에 작성
- `.d.ts` 파일은 전역 타입 선언용 (tsconfig에서 자동 인식)
- `publicApi`는 세그먼트 단위로 작성

## API 작성 가이드

### Entities - Endpoint 정의

```typescript
// entities/home/config/home-endpoint.ts
const VERSION_PREFIX = {
  home: "/home",
};

export const homeApiEndPoint = {
  getHome: () => `${VERSION_PREFIX.home}`,
  getHomeDetail: ({ id }: { id: string }) =>
    `${VERSION_PREFIX.home}/${id}/detail`,
  deleteHome: ({ id }: { id: string }) => `${VERSION_PREFIX.home}/${id}`,
};
```

### Entities - API 호출 함수

```typescript
// entities/home/api/home.api.ts
import { publicApi } from "@/shared/lib";
import type { HomeListResponseDTO, HomeResponseDTO } from "../model";
import { homeApiEndPoint } from "../config";

export const getHomeList = async () => {
  const response = await publicApi.get<HomeListResponseDTO>(
    homeApiEndPoint.getHome()
  );
  return response.data.data;
};

export const getHomeDetail = async ({ id }: { id: string }) => {
  const response = await publicApi.get<HomeResponseDTO>(
    homeApiEndPoint.getHomeDetail({ id })
  );
  return response.data.data;
};

export const deleteHome = async ({ id }: { id: string }) => {
  const response = await publicApi.delete(homeApiEndPoint.deleteHome({ id }));
  return response.data;
};
```

### Entities - Query Factory

```typescript
// entities/home/model/home.queries.ts
import { queryOptions } from "@tanstack/react-query";
import { getHomeList, getHomeDetail } from "../api/home.api";

export const homeQueries = {
  all: () => ["home"] as const,
  lists: () => [...homeQueries.all(), "list"] as const,
  list: () =>
    queryOptions({
      queryKey: homeQueries.lists(),
      queryFn: getHomeList,
    }),
  details: () => [...homeQueries.all(), "detail"] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...homeQueries.details(), id] as const,
      queryFn: () => getHomeDetail({ id }),
    }),
};
```

### Entities - Mutation Hook

```typescript
// entities/home/model/home.mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHome } from "../api/home.api";
import { homeQueries } from "./home.queries";

export const useDeleteHome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homeQueries.all() });
    },
  });
};
```

### Pages - UI에서 사용

```typescript
// pages/home/ui/home-user.tsx
import { useQuery } from "@tanstack/react-query";
import { homeQueries } from "@/entities/home";

export const HomeUser = () => {
  const { data: users, isLoading } = useQuery(homeQueries.list());

  if (isLoading) return <div>로딩중...</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

## MSW 설정

### Entities - Mock Handlers

```typescript
// entities/home/api/home.handlers.ts
import { http, HttpResponse, type HttpHandler } from "msw";
import { prependApiUrl } from "@/shared/lib";
import { homeApiEndPoint, homeListMockData } from "../config";

export const homeHandlers: HttpHandler[] = [
  http.get(prependApiUrl(homeApiEndPoint.getHome()), () => {
    return HttpResponse.json(homeListMockData);
  }),
  http.delete(prependApiUrl(homeApiEndPoint.deleteHome({ id: ":id" })), () => {
    return HttpResponse.json({ success: true });
  }),
];

export const homeError404Handler: HttpHandler = http.get(
  prependApiUrl(homeApiEndPoint.getHome()),
  () => {
    return HttpResponse.json(null, { status: 404 });
  }
);
```

### Entities - Mock Data

```typescript
// entities/home/config/home.fixtures.ts
import type { Home } from "../model/home.dto";

export const homeListMockData = {
  data: [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ],
};
```

## Zustand Store

```typescript
// shared/store/use-bear-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type BearState = {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
};

export const useBearStore = create<BearState>()(
  persist(
    (set) => ({
      bears: 0,
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 }),
    }),
    {
      name: "bear-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

## UI 스타일 가이드

### shadcn/ui 컴포넌트 구조

```
shared/ui/
└── button/
    ├── button.tsx           # 컴포넌트
    ├── button-variants.ts   # 스타일 variants (cva)
    └── index.ts             # export
```

### Variants 커스터마이징 (cva)

shadcn 컴포넌트의 스타일은 `class-variance-authority`를 사용하여 관리합니다.

```typescript
// shared/ui/button/button-variants.ts
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  // 기본 스타일 (모든 variant에 공통 적용)
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // variant 옵션
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border bg-background hover:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // size 옵션
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    // 기본값
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 컴포넌트에서 Variants 사용

```typescript
// shared/ui/button/button.tsx
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib";
import { buttonVariants } from "./button-variants";

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};
```

### 사용 예시

```tsx
// 기본 사용
<Button>Click me</Button>

// variant 변경
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>

// size 변경
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// 조합
<Button variant="secondary" size="lg">Large Secondary</Button>

// 추가 클래스
<Button className="w-full">Full Width</Button>
```

### 새 Variant 추가하기

```typescript
// button-variants.ts
variants: {
  variant: {
    // 기존 variants...
    primary: "bg-blue-500 text-white hover:bg-blue-600",  // 새 variant 추가
  },
}
```

### 테마 색상 (CSS Variables)

shadcn은 CSS 변수를 사용하여 테마를 관리합니다. `index.css`에서 수정:

```css
:root {
  --primary: 220 90% 56%;
  --primary-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --secondary: 220 14% 96%;
  /* ... */
}
```

## Pull Request

### 기본 원칙

- 모든 기능 개발 및 버그 수정은 PR을 생성하여 반영됩니다.
- 단, 핫픽스와 같은 긴급 수정 사항은 경우에 따라 바로 `main` 브랜치에 병합할 수 있습니다.