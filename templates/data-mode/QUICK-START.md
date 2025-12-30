# Data Mode Quick Start

This is a **5-minute guide** to get started with the hybrid Data Mode pattern.

## What You Get

- ✅ No loading spinner on first visit (data pre-loaded)
- ✅ Instant repeat visits (TanStack Query cache)
- ✅ Background refetching (data stays fresh)
- ✅ Type-safe (no undefined checks)

## 3-Step Implementation

### Step 1: Create Query Definition

```typescript
// features/users/api/user-queries.ts
import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '~/shared/api/client'

export const userQuery = (userId: string) =>
  queryOptions({
    queryKey: ['users', userId],
    queryFn: () => apiClient.get(`users/${userId}`).json(),
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

### Step 3: Use in Component

```typescript
// pages/users/[id].tsx
import { useLoaderData, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { userQuery } from '~/features/users/api/user-queries'

export default function UserPage() {
  const initialData = useLoaderData()
  const { userId } = useParams()
  
  const { data: user } = useQuery({
    ...userQuery(userId!),
    initialData,
  })
  
  return <div>{user.name}</div>
}
```

### Step 4: Add to Router

```typescript
// src/app/routes/index.tsx
import { queryClient } from '~/shared/lib/react-query'
import { userLoader } from '~/features/users/api/user-loader'

const router = createBrowserRouter([
  {
    path: 'users/:userId',
    loader: userLoader(queryClient),
    Component: UserPage,
  },
])
```

## That's It!

Your route now:
1. Pre-fetches data before rendering (no spinner)
2. Uses cached data on repeat visits (instant)
3. Refetches in background if stale (stays fresh)

## Next Steps

- **Forms?** Check `user-actions.example.ts` for mutation handling
- **More examples?** See `README.md` in this directory
- **Full guide?** Read `docs/data-mode-rr.md`

## When NOT to Use

Keep the current approach (Declarative Mode) for:
- Simple pages without complex data needs
- Pages where loading states are acceptable
- Real-time data with polling
- Data fetched on user interaction

Use Data Mode when you need its specific benefits, not just because it exists.
