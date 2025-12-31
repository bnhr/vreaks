# React Router Data Mode Templates

This directory contains example files demonstrating the **hybrid approach** of combining React Router Data Mode with TanStack Query for optimal data loading.

## What is the Hybrid Approach?

The hybrid approach combines:
- **React Router loaders** - Pre-fetch data before route renders (no loading spinner)
- **TanStack Query** - Caching, background refetching, and stale-while-revalidate

This gives you the best of both worlds:
- ✅ Instant first render (loader pre-fetches)
- ✅ Instant repeat visits (TanStack Query cache)
- ✅ Background refetching (keep data fresh)
- ✅ Type safety (initialData narrows types)

## When to Use This Pattern

Consider using Data Mode when your app needs:

1. **Form-heavy features** - Actions make form handling simpler
2. **Route-level auth** - Middleware is cleaner than component guards
3. **Performance optimization** - Parallel loaders prevent data waterfalls
4. **Scaling complexity** - More structure as app grows

For simple apps, the current Declarative Mode + TanStack Query is sufficient.

## Available Templates

### 1. Query Definitions (`user-queries.example.ts.md`)

Defines reusable query configurations using `queryOptions()`:
- Works with both loaders and `useQuery`
- Single source of truth for query config
- Type-safe query keys and data

**To use:** Copy content to `features/[feature-name]/api/[feature]-queries.ts`

### 2. Loaders (`user-loader.example.ts.md`)

Creates loaders that pre-fetch data before rendering:
- Uses TanStack Query cache
- Returns cached data instantly
- Fetches fresh data if not cached
- Type-safe with route params

**To use:** Copy content to `features/[feature-name]/api/[feature]-loader.ts`

### 3. Actions (`user-actions.example.ts.md`)

Creates actions for form submissions and mutations:
- Handles form data
- Invalidates TanStack Query cache
- Redirects after success
- Error handling

**To use:** Copy content to `features/[feature-name]/api/[feature]-actions.ts`

### 4. Component (`user-page.example.tsx.md`)

Shows how to use loader data with `useQuery`:
- Gets pre-loaded data from loader
- Uses `initialData` for instant render
- Background refetch if stale
- Type-safe (no undefined checks)

**To use:** Copy content to `pages/[feature-name]/[page-name].tsx`

### 5. Router Config (`router-config.example.tsx.md`)

Shows how to configure router with loaders and actions:
- Pass QueryClient to loaders/actions
- Add error boundaries
- Mix Declarative and Data Mode
- Parallel data loading

**To use:** Copy relevant parts to `src/app/routes/index.tsx` (merge with existing)

## Quick Start

### Step 1: Create Query Definitions

```typescript
// features/users/api/user-queries.ts
import { queryOptions } from '@tanstack/react-query'

export const userQuery = (userId: string) =>
  queryOptions({
    queryKey: ['users', userId],
    queryFn: async () => {
      // Your fetch logic here
    },
  })
```

### Step 2: Create Loader

```typescript
// features/users/api/user-loader.ts
import type { QueryClient } from '@tanstack/react-query'
import { userQuery } from './user-queries'

export const userLoader = (queryClient: QueryClient) =>
  async ({ params }) => {
    return queryClient.ensureQueryData(userQuery(params.userId!))
  }
```

### Step 3: Create Action (Optional)

```typescript
// features/users/api/user-actions.ts
import type { QueryClient } from '@tanstack/react-query'
import { redirect } from 'react-router'

export const updateUserAction = (queryClient: QueryClient) =>
  async ({ request, params }) => {
    const formData = await request.formData()
    // Update user logic
    await queryClient.invalidateQueries({ queryKey: ['users'] })
    return redirect(`/users/${params.userId}`)
  }
```

### Step 4: Use in Component

```typescript
// pages/users/[id].tsx
import { useLoaderData, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { userQuery } from '~/features/users/api/user-queries'

export default function UserPage() {
  const initialData = useLoaderData() as User
  const { userId } = useParams()
  
  const { data: user } = useQuery({
    ...userQuery(userId!),
    initialData,
  })
  
  return <div>{user.name}</div>
}
```

### Step 5: Add to Router

```typescript
// src/app/routes/index.tsx
import { queryClient } from '~/shared/lib/react-query'
import { userLoader } from '~/features/users/api/user-loader'
import { updateUserAction } from '~/features/users/api/user-actions'

const router = createBrowserRouter([
  {
    path: 'users/:userId',
    loader: userLoader(queryClient),
    action: updateUserAction(queryClient),
    Component: UserPage,
  },
])
```

## Comparison: Current vs Hybrid Approach

### Current Approach (Declarative Mode)

```typescript
// Route
{ path: 'users/:userId', Component: UserPage }

// Component
function UserPage() {
  const { userId } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId)
  })
  
  if (isLoading) return <Spinner />
  return <div>{data.name}</div>
}
```

**Pros:**
- Simple and straightforward
- Familiar React pattern
- Full TanStack Query features

**Cons:**
- Shows loading spinner on first visit
- Data fetches after component renders
- Potential waterfall loading

### Hybrid Approach (Data Mode + TanStack Query)

```typescript
// Route
{
  path: 'users/:userId',
  loader: userLoader(queryClient),
  Component: UserPage
}

// Component
function UserPage() {
  const initialData = useLoaderData() as User
  const { userId } = useParams()
  
  const { data } = useQuery({
    ...userQuery(userId!),
    initialData,
  })
  
  return <div>{data.name}</div>  // No loading check needed!
}
```

**Pros:**
- No loading spinner (data pre-loaded)
- Instant repeat visits (cached)
- Background refetch (stays fresh)
- Type-safe (no undefined)

**Cons:**
- More setup (loaders + queries)
- Slightly more complex
- Need to understand both patterns

## Migration Strategy

You don't need to migrate everything at once. You can:

1. **Keep current approach** for simple pages
2. **Use hybrid approach** for complex pages that benefit from it
3. **Mix both approaches** in the same router

Example:

```typescript
const router = createBrowserRouter([
  {
    path: 'simple',
    Component: SimplePage  // Current approach
  },
  {
    path: 'complex/:id',
    loader: complexLoader(queryClient),  // Hybrid approach
    Component: ComplexPage
  },
])
```

## Best Practices

1. **Start small** - Try hybrid approach on one route first
2. **Use queryOptions()** - Ensures consistency between loaders and components
3. **Decide on await** - Choose whether to wait for refetch or redirect immediately
4. **Error boundaries** - Add errorElement to routes with loaders
5. **Type safety** - Use TypeScript for loader/action types

## Common Patterns

### Pattern 1: List + Detail Pages

```typescript
// List page - pre-fetch all items
{
  path: 'users',
  loader: usersLoader(queryClient),
  Component: UsersListPage
}

// Detail page - pre-fetch single item
{
  path: 'users/:userId',
  loader: userLoader(queryClient),
  Component: UserDetailPage
}
```

### Pattern 2: Edit Form with Action

```typescript
{
  path: 'users/:userId/edit',
  loader: userLoader(queryClient),
  action: updateUserAction(queryClient),
  Component: EditUserPage
}
```

### Pattern 3: Create Form with Action

```typescript
{
  path: 'users/new',
  action: createUserAction(queryClient),
  Component: NewUserPage
}
```

## Resources

- [React Router Data Mode Docs](https://reactrouter.com/start/data/installation)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- [React Query meets React Router](https://tkdodo.eu/blog/react-query-meets-react-router) by TkDodo
- [Full Documentation](../../docs/data-mode-rr.md)

## Questions?

- Check the full documentation: `docs/data-mode-rr.md`
- Review example files in this directory
- Look at inline comments in template files

---

**Remember:** These are templates to help you scale. Use them when you need them, not because you feel you should. The current Declarative Mode approach is perfectly fine for many applications.

