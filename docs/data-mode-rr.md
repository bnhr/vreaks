# React Router 7 Data Mode Migration Plan

## Current State

The project currently uses **Declarative Mode** with React Router 7:
- Using `createBrowserRouter` with basic route configuration
- Component-based routing with `Component` property
- Manual data fetching with TanStack Query in components
- No loaders, actions, or route-level data APIs

## What is Data Mode?

Data Mode moves route configuration outside React rendering and adds powerful data management features:

- **Loaders**: Fetch data before route renders (replaces useEffect + TanStack Query in many cases)
- **Actions**: Handle form submissions and mutations with automatic revalidation
- **Middleware**: Run code before/after navigations (auth, logging, etc.)
- **useFetcher**: Non-navigational data loading and mutations
- **Pending States**: Built-in loading states via `useNavigation`
- **Automatic Revalidation**: Loaders re-run after actions complete

## Key Differences from Current Approach

### Current (Declarative Mode + TanStack Query)
```tsx
// Route definition
{
  path: '/users',
  Component: UsersPage
}

// Component
function UsersPage() {
  const { data, isLoading } = useUsersQuery() // TanStack Query
  
  if (isLoading) return <Spinner />
  return <UserList users={data} />
}
```

### With Data Mode
```tsx
// Route definition with loader
{
  path: '/users',
  loader: async () => {
    const users = await apiClient.get('users').json()
    return { users }
  },
  Component: UsersPage
}

// Component
function UsersPage() {
  const { users } = useLoaderData() // Data already loaded
  return <UserList users={users} />
}
```

## Benefits of Data Mode

1. **Parallel Data Loading**: All loaders for matched routes run in parallel
2. **Waterfall Prevention**: Data loads before component renders (no useEffect waterfalls)
3. **Built-in Pending States**: `useNavigation()` provides global loading state
4. **Form Handling**: `<Form>` component with automatic revalidation
5. **Optimistic UI**: Easy to implement with `useFetcher`
6. **Error Boundaries**: Route-level error handling with `errorElement`

## Migration Considerations

### What We'd Gain

✅ **Simpler Data Flow**: Data loading declaratively defined in routes
✅ **Better Performance**: Parallel loading, no render waterfalls
✅ **Form Mutations**: Built-in form handling with actions
✅ **Middleware**: Centralized auth/logging logic
✅ **Type Safety**: Better TypeScript support with loaders/actions

### What We'd Lose/Change

⚠️ **TanStack Query Features**: 
- Background refetching
- Cache management
- Stale-while-revalidate
- Query invalidation
- Optimistic updates (though useFetcher helps)

⚠️ **Current Patterns**:
- Need to refactor all data fetching from components to loaders
- Zustand remains for UI state (good!)

## Hybrid Approach (Recommended)

> **Reference**: [React Query meets React Router](https://tkdodo.eu/blog/react-query-meets-react-router) by TkDodo

The best approach is to **combine React Router loaders with TanStack Query caching**:

- **Router loaders** fetch data as early as possible (before component renders)
- **TanStack Query** provides caching, background refetching, and stale-while-revalidate

### The Pattern

**Key insight**: "React Router is not a cache" - loaders fetch on every navigation, but TanStack Query can cache the results.

```tsx
// 1. Pass QueryClient to loader
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/contacts/:contactId',
    loader: contactLoader(queryClient),
    Component: ContactPage
  }
])

// 2. Loader uses ensureQueryData (or getQueryData ?? fetchQuery)
const contactLoader = (queryClient: QueryClient) => 
  async ({ params }: LoaderFunctionArgs) => {
    const query = contactQuery(params.contactId!)
    
    // Return cached data if available, otherwise fetch
    return queryClient.ensureQueryData(query)
    
    // Alternative approach:
    // return (
    //   queryClient.getQueryData(query.queryKey) ??
    //   await queryClient.fetchQuery(query)
    // )
  }

// 3. Component uses useQuery with loader data as initialData
function ContactPage() {
  const initialData = useLoaderData() as Contact
  const params = useParams()
  
  const { data } = useQuery({
    ...contactQuery(params.contactId!),
    initialData, // Type-safe: data is Contact, not Contact | undefined
  })
  
  return <ContactDetails contact={data} />
}
```

### Benefits of This Hybrid

✅ **First visit**: Loader fetches before render (no loading spinner)
✅ **Repeat visits**: Instant stale data from cache + background refetch
✅ **Navigation**: Data loads early (router knows destination first)
✅ **Caching**: TanStack Query handles cache, staleness, refetching
✅ **Type safety**: `initialData` from loader narrows type to non-undefined

### Actions + Query Invalidation

```tsx
// Action with query invalidation
const updateContactAction = (queryClient: QueryClient) =>
  async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const updates = Object.fromEntries(formData)
    
    await apiClient.put(`contacts/${params.contactId}`, { json: updates })
    
    // Invalidate queries - await controls behavior:
    await queryClient.invalidateQueries({ queryKey: ['contacts'] })
    // ☝️ WITH await: Wait for refetch, then redirect (fresh data)
    
    // queryClient.invalidateQueries({ queryKey: ['contacts'] })
    // ☝️ WITHOUT await: Redirect immediately, show stale data, refetch in background
    
    return redirect(`/contacts/${params.contactId}`)
  }
```

**The `await` lever**: Control whether to wait for fresh data or show stale data immediately.

### When to Use What

**Use loaders + TanStack Query for:**
- Route-dependent data (user details, post by ID)
- List views that benefit from caching
- Data that should load before component renders

**Use TanStack Query only (no loader) for:**
- Real-time data (notifications, live updates)
- Data fetched on user interaction (search, filters)
- Polling/background refetching
- Data shared across routes without navigation

**Use loaders only (no TanStack Query) for:**
- Static/rarely changing data
- Simple one-time fetches
- When you don't need caching features

## Migration Path

### Phase 1: Setup QueryClient in Router

```tsx
// src/app/routes/index.tsx
import { queryClient } from '~/shared/lib/react-query'

const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        path: 'users/:userId',
        loader: userLoader(queryClient), // Pass queryClient
        Component: UserPage
      }
    ]
  }
])
```

### Phase 2: Create Query Definitions

```tsx
// features/users/api/user-queries.ts
import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '~/shared/api/client'
import type { User } from '../types/user.types'

export const userQuery = (userId: string) =>
  queryOptions({
    queryKey: ['users', userId],
    queryFn: async () => {
      return apiClient.get(`users/${userId}`).json<User>()
    },
  })
```

### Phase 3: Create Loaders with TanStack Query

```tsx
// features/users/api/user-loader.ts
import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router'
import { userQuery } from './user-queries'

export const userLoader = (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const query = userQuery(params.userId!)
    
    // Option 1: Use ensureQueryData (TanStack Query v5+)
    return queryClient.ensureQueryData(query)
    
    // Option 2: Manual fallback pattern (equivalent)
    // return (
    //   queryClient.getQueryData(query.queryKey) ??
    //   await queryClient.fetchQuery(query)
    // )
  }
```

### Phase 4: Use in Components

```tsx
// pages/user.tsx
import { useLoaderData, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { userQuery } from '~/features/users/api/user-queries'
import type { User } from '~/features/users/types/user.types'

export default function UserPage() {
  const initialData = useLoaderData() as User
  const { userId } = useParams()
  
  // Gets cached data instantly + background refetch if stale
  const { data: user } = useQuery({
    ...userQuery(userId!),
    initialData, // Type is now User, not User | undefined
  })
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### Phase 5: Add Actions with Invalidation

```tsx
// features/users/api/user-actions.ts
import type { QueryClient } from '@tanstack/react-query'
import type { ActionFunctionArgs } from 'react-router'
import { redirect } from 'react-router'
import { apiClient } from '~/shared/api/client'

export const updateUserAction = (queryClient: QueryClient) =>
  async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const updates = Object.fromEntries(formData)
    
    await apiClient.put(`users/${params.userId}`, { json: updates })
    
    // Invalidate and wait for refetch
    await queryClient.invalidateQueries({ queryKey: ['users'] })
    
    return redirect(`/users/${params.userId}`)
  }

// In router config
{
  path: 'users/:userId/edit',
  loader: userLoader(queryClient),
  action: updateUserAction(queryClient),
  Component: EditUserPage
}
```

### Phase 6: Add Middleware for Auth (Optional)

```tsx
// features/auth/middleware/auth-middleware.ts
import { redirect } from 'react-router'
import { getToken } from '~/shared/utils/auth'

export async function authMiddleware({ request }: any, next: () => Promise<void>) {
  const token = getToken()
  
  if (!token) {
    const url = new URL(request.url)
    throw redirect(`/login?redirect=${url.pathname}`)
  }
  
  await next()
}

// In router config
{
  path: '/admin',
  middleware: [authMiddleware],
  Component: AdminLayout,
  children: [...]
}
```

## Data Mode APIs Available

### Route Object Properties
- `loader` - Fetch data before render
- `action` - Handle form submissions/mutations
- `middleware` - Pre/post navigation logic
- `errorElement` - Error boundary component
- `shouldRevalidate` - Control when loaders re-run

### Hooks
- `useLoaderData()` - Access loader data
- `useActionData()` - Access action response
- `useFetcher()` - Non-navigational loads/mutations
- `useNavigation()` - Global navigation state
- `useRevalidator()` - Manually trigger revalidation
- `useRouteLoaderData()` - Access parent loader data

### Components
- `<Form>` - Enhanced form with actions
- `<Await>` - Deferred data loading
- `<ScrollRestoration>` - Restore scroll position

## API Integration

### Current Pattern (Query Hooks)
```tsx
// features/users/api/use-users-query.ts
export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return apiClient.get('users').json()
    }
  })
}
```

### With Hybrid Approach (Query Options + Loaders)

```tsx
// features/users/api/user-queries.ts
import { queryOptions } from '@tanstack/react-query'

export const usersQuery = () =>
  queryOptions({
    queryKey: ['users'],
    queryFn: async () => {
      return apiClient.get('users').json()
    },
  })

// features/users/api/users-loader.ts
export const usersLoader = (queryClient: QueryClient) => async () => {
  return (
    queryClient.getQueryData(usersQuery().queryKey) ??
    await queryClient.fetchQuery(usersQuery())
  )
}

// Component
function UsersPage() {
  const initialData = useLoaderData() as User[]
  const { data: users } = useQuery({
    ...usersQuery(),
    initialData,
  })
  
  return <UserList users={users} />
}
```

**Benefits:**
- Mock logic stays in one place (query definition)
- Loader automatically respects mock flag
- Component gets cached data + background refetch

## Framework Mode (Future Consideration)

Framework Mode adds even more features:
- Vite plugin integration
- File-based routing (optional)
- Type-safe params and loaderData
- Automatic code splitting
- SSR/SSG/SPA strategies
- Pre-rendering support

**Not recommended yet** because:
- Requires more architectural changes
- Adds build complexity
- Current SPA approach works well
- Can migrate later if needed

## Decision Matrix

| Feature | Current (Declarative + TanStack Query) | Data Mode | Framework Mode |
|---------|---------------------------------------|-----------|----------------|
| Route matching | ✅ | ✅ | ✅ |
| Data loading | TanStack Query | Loaders | Loaders + Type Safety |
| Mutations | TanStack Query | Actions | Actions + Type Safety |
| Caching | TanStack Query | Manual | Manual |
| Background refetch | ✅ | ❌ | ❌ |
| Form handling | Manual | `<Form>` | `<Form>` + Validation |
| Auth middleware | Component-level | Route middleware | Route middleware |
| Code splitting | Manual lazy() | Manual lazy() | Automatic |
| SSR/SSG | ❌ | ❌ | ✅ |
| Type safety | Good | Better | Best |
| Complexity | Low | Medium | High |

## Recommendation

**Stay with Declarative Mode + TanStack Query for now**, but consider Data Mode when:

1. **Form-heavy features**: Actions make form handling much simpler
2. **Route-level auth**: Middleware is cleaner than component guards
3. **Performance issues**: Parallel loaders can help with data waterfalls
4. **Team preference**: If team wants more "framework" features

**Gradual adoption is possible**: You can mix Declarative and Data Mode routes in the same app.

## Resources

- [React Router Modes](https://reactrouter.com/start/modes) - Official docs on Declarative, Data, and Framework modes
- [Data Mode Installation](https://reactrouter.com/start/data/installation) - Getting started with Data Mode
- [Route Object API](https://reactrouter.com/start/data/route-object) - Loaders, actions, middleware reference
- [React Query meets React Router](https://tkdodo.eu/blog/react-query-meets-react-router) - TkDodo's guide on hybrid approach
- [React Query + React Router Example](https://tanstack.com/query/latest/docs/framework/react/examples/react-router) - Official TanStack example

---

**Last Updated**: December 31, 2024
**Status**: Planning Document - Hybrid Approach (Loaders + TanStack Query)

## Implementation Templates

Ready-to-use example files are available in `templates/data-mode/`:

- **user-queries.example.ts.md** - Query definitions with queryOptions()
- **user-loader.example.ts.md** - Loaders for data pre-fetching
- **user-actions.example.ts.md** - Actions for form handling
- **user-page.example.tsx.md** - Component using loader data
- **router-config.example.tsx.md** - Router configuration
- **README.md** - Complete guide and quick start
- **QUICK-START.md** - 5-minute implementation guide

**Note:** Template files use `.md` extension (e.g., `.ts.md`) to prevent TypeScript/linting errors. Copy the content and save with the proper extension (`.ts`, `.tsx`).

These templates demonstrate the hybrid pattern described in this document. Copy and adapt them when you're ready to implement Data Mode in your application.

**Next Steps**: 
1. Review hybrid pattern with team
2. Check example templates in `templates/data-mode/`
3. Start with one route as proof of concept
4. Gradually adopt for routes that benefit from it
