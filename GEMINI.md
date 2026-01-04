# Luigi Log - GEMINI Context

## Project Overview

**Luigi Log** is a personal technical blog and portfolio platform themed after the character Luigi. It aims to combine professional technical content with a fun, interactive, game-like user experience.

- **Type:** Personal Tech Blog & Portfolio
- **Core Concept:** "Fun, Professional, Unique" with a Luigi theme.
- **Key Feature:** 3D Interactive Hero Section (Three.js), Game-like UI elements.

## Key Documentation

*   **`docs/tech-spec.md`**: **Technical Spec.** Tech stack, Architecture, and State management strategies.
*   **`docs/conventions.md`**: **Coding Standards.** Naming, Code Style, FSD patterns, and Commit conventions.

## Architecture: Feature-Sliced Design (FSD)

The project follows the **Feature-Sliced Design** architecture.

### Layer Hierarchy
`app` > `pages` > `features` > `entities` > `shared`

*   **Upper layers can import lower layers.**
*   **Lower layers cannot import upper layers.**
*   **Cross-imports within the same layer (between slices) are forbidden.**

### Directory Structure
```
src/
├── app/                  # App-wide settings, styles, providers, router (main.tsx)
├── pages/                # Page components (routed pages)
│   └── [page-name]/
│       └── ui/           # UI components only
├── features/             # Business features shared across pages (optional)
│   └── [feature-name]/
│       └── ui/           # Shared UI components
├── entities/             # Business entities (Data model, API, Store)
│   └── [entity]/
│       ├── api/          # API calls, mock handlers
│       ├── config/       # Mock data, constants
│       └── model/        # Types (DTO), query factory
├── shared/               # Reusable infrastructure code
│   ├── lib/              # Utils, API client (axios)
│   ├── ui/               # Common UI components (shadcn/ui)
│   ├── config/           # Env vars, global config
│   ├── type/             # Common types
│   └── store/            # Global store (Zustand)
```

## Tech Stack

- **Core:** React 19, TypeScript, Vite (SWC)
- **State Management:** TanStack Query (Server), Zustand (Global/Client)
- **Styling:** Tailwind CSS, shadcn/ui
- **Routing:** React Router
- **Forms:** React Hook Form + Zod
- **Linting/Formatting:** Biome
- **Package Manager:** pnpm

## Development

### Prerequisites
- Node.js 18+
- pnpm 8+

### Commands

| Command | Description |
| :--- | :--- |
| `pnpm install` | Install dependencies. |
| `pnpm dev` | Start the development server. |
| `pnpm build` | Build for production. |
| `pnpm preview` | Preview production build. |
| `pnpm lint` | Run Biome linting/formatting. |

## Coding Conventions

### Naming
- **Folders:** `hyphen-case` (e.g., `user-list`)
- **Files:** `hyphen-case` (e.g., `user-list.tsx`)
- **Components:** `PascalCase` (e.g., `UserList`)
- **Functions/Vars:** `camelCase` (e.g., `fetchUsers`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- **Hooks:** `use` + `camelCase` (e.g., `useCreateUser`)
- **Event Handlers:** `handle` + `camelCase` (e.g., `handleClick`)

### Code Style
- **Functions:** Always use **Arrow Functions**.
- **Types:** Use `interface` for objects, `type` for unions/intersections/primitives.
- **Props:** Use `interface` for component props.
- **Imports:**
    1.  React / External Libs
    2.  Absolute Imports (`@/shared/...`)
    3.  Relative Imports (`../../`)

### React Query Pattern
- Use **Query Key Factory** pattern (`userQueries.all`, `userQueries.list`).
- Encapsulate queries/mutations in custom hooks in `model/`.

### API & Mocking
- **API Client:** Use `publicApi` from `@/shared/lib`.
- **Endpoints:** Define in `config/[entity]-endpoint.ts`.
- **Mocking:** Use **MSW** (Mock Service Worker).

## Commit Messages

Follow **Conventional Commits**: `<type>: <description>`

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Refactoring (no functional change)
- `chore`: Build/Config changes