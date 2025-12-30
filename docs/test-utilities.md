# Test Utilities

This document describes the reusable test utilities available in `src/test/`.

## Overview

The test utilities provide helpers for:
- **Test data generation** - Factory functions for creating consistent test data
- **Resource cleanup** - Disposable objects for automatic cleanup
- **Component rendering** - Wrappers for rendering with providers
- **State management testing** - Utilities for React Query and Zustand

## Modules

### setup.ts
Global test configuration and environment setup. Automatically loaded before tests run.

### factories.ts
Factory functions for generating test data with sensible defaults.

**Available Factories:**
- `userFactory` - Create test users
- `authFactory` - Create authentication states
- `createApiResponseFactory<T>()` - Create API response factories

**Example:**
```typescript
import { userFactory, authFactory } from '~/test'

// Create a single user
const user = userFactory.build({ role: 'admin' })

// Create multiple users
const users = userFactory.buildList(5)

// Create auth state
const authState = authFactory.build({ isAuthenticated: true })
```

### disposables.ts
Disposable resource utilities for automatic cleanup using TypeScript's disposable pattern.

**Available Functions:**
- `createDisposable<T>()` - Wrap any resource with cleanup logic
- `createTestServer()` - Create a disposable HTTP server
- `createTestDatabase()` - Create a disposable database connection (placeholder)

**Example:**
```typescript
import { createTestServer } from '~/test'

test('example with disposable server', async () => {
  await using server = await createTestServer()
  
  // Use server.url for requests
  const response = await fetch(server.url)
  
  // Server automatically closes when scope exits
})
```

### render-utils.tsx
Component rendering utilities with provider setup.

**Available Functions:**
- `createTestQueryClient()` - Create a QueryClient with test-friendly defaults
- `renderWithProviders()` - Render components with QueryClientProvider and Router

**Example:**
```typescript
import { renderWithProviders } from '~/test'
import { screen } from '@testing-library/react'

test('renders component with providers', () => {
  const { queryClient } = renderWithProviders(<MyComponent />)
  
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### state-utils.ts
State management testing utilities for React Query and Zustand.

**React Query Utilities:**
- `mockApiResponse()` - Mock API responses in QueryClient cache
- `waitForQuery()` - Wait for async queries to complete

**Zustand Utilities:**
- `renderHookWithStore()` - Render hooks with store access
- `registerStore()` - Register stores for automatic cleanup
- `resetAllStores()` - Reset all registered stores

**Example:**
```typescript
import { 
  createTestQueryClient, 
  mockApiResponse, 
  waitForQuery,
  registerStore,
  resetAllStores 
} from '~/test'

// React Query example
test('mocking API responses', async () => {
  const queryClient = createTestQueryClient()
  
  await mockApiResponse(
    queryClient,
    ['users', '123'],
    { id: '123', name: 'John' }
  )
  
  const data = queryClient.getQueryData(['users', '123'])
  expect(data).toEqual({ id: '123', name: 'John' })
})
```

## Usage Patterns

### Testing Components with React Query

```typescript
import { renderWithProviders, mockApiResponse } from '~/test'
import { screen, waitFor } from '@testing-library/react'

test('component with React Query', async () => {
  const { queryClient } = renderWithProviders(<UserProfile userId="123" />)
  
  // Mock the API response
  await mockApiResponse(
    queryClient,
    ['users', '123'],
    { id: '123', name: 'John Doe' }
  )
  
  // Wait for the component to render with data
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

### Testing Zustand Stores

```typescript
import { registerStore, resetAllStores } from '~/test'
import { create } from 'zustand'

const useUserStore = create((set) => ({
  users: [],
  addUser: (user) => set((state) => ({ users: [...state.users, user] }))
}))

beforeEach(() => {
  registerStore(useUserStore)
  resetAllStores()
})

test('adding users to store', () => {
  const store = useUserStore.getState()
  
  store.addUser({ id: '1', name: 'Alice' })
  expect(useUserStore.getState().users).toHaveLength(1)
})
```

### Testing with Disposable Resources

```typescript
import { createTestServer } from '~/test'

test('testing with server', async () => {
  await using server = await createTestServer()
  
  const response = await fetch(server.url)
  expect(response.ok).toBe(true)
  
  // Server automatically cleaned up
})
```

## Best Practices

1. **Use factories for test data** - Consistent, type-safe test data generation
2. **Use disposables for resources** - Automatic cleanup prevents resource leaks
3. **Mock at the API level** - Use `mockApiResponse` instead of mocking React Query internals
4. **Reset stores between tests** - Use `resetAllStores()` in `beforeEach` for test isolation
5. **Use `waitForQuery` for async operations** - Avoid flaky tests with proper waiting
