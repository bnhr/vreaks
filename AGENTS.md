# Agent Guidelines

**Tech Stack:** React 19 + TypeScript + Bun + React Router 7 + Tailwind v4 + TanStack Query + Zustand + ky + Vitest

**Commands:** `bun install` | `bun run dev` | `bun run test` (NOT `bun test`) | `bun run build`

**Path Alias:** `~` → `src/`

## Core Rules

**Package Manager:** Always use Bun (not npm/yarn/pnpm). Bun auto-loads `.env` files.

**Naming:** kebab-case for all files/folders (`user-profile.tsx`, not `UserProfile.tsx`)

## State Management (Critical)

1. **TanStack Query** - ALL API data (users, posts, auth from `/me`)
2. **Zustand** - UI state (theme, modals, preferences)
3. **useState** - Local component state

**❌ NEVER:** Use Context for state | Duplicate API data in Zustand

## TypeScript

- Strict mode enabled, avoid `any`
- PascalCase: types/interfaces | camelCase: variables/functions | UPPER_SNAKE_CASE: constants

## Testing

**CRITICAL:** Use `bun run test` (NOT `bun test` - breaks Vitest config)

- Use `renderWithProviders` from `~/test` for components
- Test user behavior, not implementation
- Arrange-Act-Assert pattern

## Styling

- Tailwind v4 utility classes
- Use `cn()` from `~/shared/utils/cn` for conditional classes (merges + resolves conflicts)

## API Pattern

**Client:** ky + TanStack Query (auto token refresh, retry logic in `~/shared/api/client.ts`)

**Structure:** `features/users/api/use-users-query.ts` → Check `USE_MOCK_API` → Return mock or real data

**Always handle:** `isLoading`, `isError` states in components

## Forms

- Simple: `useState`
- Complex: React Hook Form (if installed)

## Environment

- `VITE_*` prefix for client-side vars (exposed to browser)
- Bun auto-loads `.env` (no dotenv needed)

## Import Order Convention

Keep imports organized for consistency:

```typescript
// 1. External libraries (React, third-party packages)
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal modules with path alias (~)
import { apiClient } from '~/shared/api/client'
import { useAuth } from '~/features/auth/hooks/use-auth'
import { Button } from '~/shared/components/button'

// 3. Relative imports
import { UserCard } from './user-card'
import { formatDate } from './utils'

// 4. Types (can be mixed with above or separated)
import type { User } from '~/features/users/types/user.types'
import type { ApiResponse } from './types'
```

## Custom Hooks Guidelines

### When to Create Custom Hooks

**DO create a custom hook when:**
- Logic is reused across multiple components
- Logic involves multiple useState/useEffect calls
- Logic encapsulates a specific domain concern (auth, form validation, etc.)
- Logic involves complex state management or side effects

```tsx
// ✅ GOOD: Reusable logic
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// ✅ GOOD: Domain-specific logic
function useAuth() {
  const { data: currentUser, isLoading } = useMeQuery()
  return {
    user: currentUser?.data,
    isAuthenticated: !!currentUser?.data,
    isLoading,
  }
}
```

**DON'T create a custom hook when:**
- It's just a single useState call
- Logic is only used once
- It's just wrapping a library hook without adding value

```tsx
// ❌ BAD: Unnecessary abstraction
function useCounter() {
  return useState(0)
}

// ✅ GOOD: Just use useState directly
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

## Component Composition Patterns

### Compound Components

For components with multiple related parts:

```tsx
interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 border-b">{children}</div>
}

function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab must be used within Tabs')
  
  return (
    <button
      className={cn('px-4 py-2', context.activeTab === value && 'border-b-2 border-blue-600')}
      onClick={() => context.setActiveTab(value)}
    >
      {children}
    </button>
  )
}

function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabPanel must be used within Tabs')
  
  return context.activeTab === value ? <div>{children}</div> : null
}

// Usage
<Tabs defaultTab="profile">
  <TabList>
    <Tab value="profile">Profile</Tab>
    <Tab value="settings">Settings</Tab>
  </TabList>
  <TabPanel value="profile">Profile content</TabPanel>
  <TabPanel value="settings">Settings content</TabPanel>
</Tabs>
```

### Render Props (use sparingly)

```tsx
interface DataFetcherProps<T> {
  url: string
  children: (data: T | null, isLoading: boolean) => React.ReactNode
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const { data, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => apiClient.get(url).json<T>(),
  })

  return <>{children(data ?? null, isLoading)}</>
}

// Usage
<DataFetcher<User> url="/api/users/1">
  {(user, isLoading) => (
    isLoading ? <Spinner /> : <UserCard user={user} />
  )}
</DataFetcher>
```

## When to Split Components

### DO split when:
- Component exceeds ~150 lines
- Component has multiple distinct responsibilities
- Part of the component is reusable elsewhere
- Component has complex conditional rendering

```tsx
// ❌ BAD: Too much in one component
function UserDashboard() {
  return (
    <div>
      <header>{/* 50 lines of header code */}</header>
      <aside>{/* 50 lines of sidebar code */}</aside>
      <main>{/* 100 lines of main content */}</main>
      <footer>{/* 30 lines of footer code */}</footer>
    </div>
  )
}

// ✅ GOOD: Split into focused components
function UserDashboard() {
  return (
    <div>
      <DashboardHeader />
      <DashboardSidebar />
      <DashboardContent />
      <DashboardFooter />
    </div>
  )
}
```

### DON'T split when:
- Component is small and focused (<50 lines)
- Split would create unnecessary prop drilling
- Components are tightly coupled and not reusable

## Routing

**Current Approach:** Declarative Mode with React Router 7 + TanStack Query

- Routes use `Component` property
- Data fetching with TanStack Query in components
- Simple, straightforward pattern

**Scaling Option:** Data Mode (Hybrid Approach)

When your app grows and needs more structure, consider the hybrid approach:
- React Router loaders for data pre-fetching
- TanStack Query for caching + background refetch
- Actions for form handling
- Middleware for auth/logging

**Templates available:** `templates/data-mode/` contains ready-to-use examples

**When to consider:**
- Form-heavy features (actions simplify mutations)
- Route-level auth (middleware is cleaner)
- Performance issues (parallel loaders)
- Team wants more structure

**Documentation:** See `docs/data-mode-rr.md` for full migration guide

## Mocks

When `VITE_USE_MOCK_API=true`, API functions check and return mock data from `~/mock/handlers/`

## Anti-Patterns

❌ Don't fetch in useEffect (use React Query)
❌ Don't duplicate API data in Zustand
❌ Don't use Context for state
❌ Don't ignore loading/error states

## Project Structure

Follow a feature-based structure:

```
src/
├── app/           # App-level configuration, providers
├── features/      # Feature modules (auth, users, etc.)
│   └── users/
│       ├── api/           # React Query hooks
│       ├── components/    # Feature-specific components
│       ├── hooks/         # Feature-specific hooks
│       ├── types/         # TypeScript types
│       └── utils/         # Feature-specific utilities
├── pages/         # Page components
├── shared/        # Shared utilities, components, hooks
│   ├── api/           # API client, endpoints, config
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Reusable hooks
│   ├── utils/         # Utility functions
│   └── config/        # App configuration
├── widgets/       # Complex reusable UI components
├── assets/        # Static assets (images, fonts)
├── mock/          # Mock API handlers
└── test/          # Test utilities and setup
```

## Best Practices

- Prettier + ESLint (husky + lint-staged)
- Conventional commits (`feat:`, `fix:`, `docs:`)
- Code split routes, lazy load heavy components
- Semantic HTML + ARIA labels
- Sanitize input, validate data, use HTTPS
