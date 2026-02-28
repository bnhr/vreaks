# Agent Guidelines

**Tech Stack:** React 19 + TypeScript + Bun + React Router 7 + Tailwind v4 + TanStack Query + Zustand + ky + Vitest

**Commands:** `bun install` | `bun run dev` | `bun run test` (NOT `bun test`) | `bun run build`

**Path Alias:** `~` → `src/`

## Critical: Verify Latest Practices

JavaScript ecosystem evolves rapidly. Before implementing solutions:
- Web search for latest stable versions and best practices
- Verify APIs aren't deprecated
- Check if recommended patterns are current
- Confirm package compatibility with our stack

## Core Rules

**Package Manager:** Always use Bun (not npm/yarn/pnpm). Bun auto-loads `.env` files.

**Naming:** kebab-case for all files/folders (`user-profile.tsx`, not `UserProfile.tsx`)

## Code Quality

Husky + lint-staged runs ESLint + Prettier on pre-commit. Don't bypass hooks.

## State Management

- **TanStack Query** - ALL API data
- **Zustand** - UI state only (theme, modals)
- **useState** - Local component state
- **Never:** Context for state | Duplicate API data in Zustand

## Quick Reference

**TypeScript:** Strict mode, avoid `any`

**Testing:** `bun run test` (NOT `bun test`). Use `renderWithProviders` from `~/test`

**Styling:** Tailwind v4 + `cn()` from `~/shared/utils/cn`

**API:** ky + TanStack Query in `features/*/api/`. Always handle `isLoading`, `isError`

**Forms:** `useState` for simple, React Hook Form for complex

**Env:** `VITE_*` prefix for client vars

## Imports

Order: External → Internal (`~`) → Relative → Types

## Patterns

**Custom Hooks:** Only for reusable logic or complex state. Don't wrap single `useState`.

**Components:** Split at ~150 lines or when reusable. Keep small components together.

## Routing

React Router 7 declarative mode. For scaling: see `templates/data-mode/` and `docs/data-mode-rr.md`

## Avoid

- Fetching in useEffect (use React Query)
- Duplicating API data in Zustand
- Context for state management
- Ignoring loading/error states

## Structure

Feature-based: `features/*/` (api, components, hooks, types) | `shared/` for reusables | `pages/` for routes
