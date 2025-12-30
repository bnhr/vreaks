# Testing Guide

This guide explains when and how to use different types of tests in this project. We use a three-tier testing approach: unit tests, component tests, and E2E tests.

## Test Types Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Testing Pyramid                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                        E2E Tests                              │
│                    (Playwright)                               │
│                  Few, Slow, High Value                        │
│                                                               │
│              ┌─────────────────────────┐                     │
│              │   Component Tests       │                     │
│              │  (Vitest Browser Mode)  │                     │
│              │   More, Faster, Focused │                     │
│              └─────────────────────────┘                     │
│                                                               │
│        ┌───────────────────────────────────────┐            │
│        │          Unit Tests                    │            │
│        │        (Vitest Node.js)                │            │
│        │   Most, Fastest, Highly Focused        │            │
│        └───────────────────────────────────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## When to Use Each Test Type

### Unit Tests (Vitest + Node.js)

**Use for:**

- Pure functions and utilities
- Business logic and data transformations
- Validation functions
- Formatters and parsers
- Helper functions
- Non-UI code

**Characteristics:**

- ✅ Very fast execution (runs in Node.js)
- ✅ No browser or DOM dependencies
- ✅ Easy to write and maintain
- ✅ Great for TDD
- ✅ High test coverage with minimal effort

**Example:**

```typescript
// src/shared/utils/format.test.ts
import { test, expect } from 'vitest'
import { formatCurrency } from './format'

test('formats USD currency correctly', () => {
	expect(formatCurrency(1234.56)).toBe('$1,234.56')
})
```

**Location:** Colocate with source files using `.test.ts` suffix

**Run with:** `bun run test` (runs all tests including unit tests)

---

### Component Tests (Vitest Browser Mode)

**Use for:**

- React component rendering
- User interactions (clicks, typing, form submissions)
- Component state changes
- Conditional rendering logic
- React hooks behavior
- Integration with React Query/Zustand

**Characteristics:**

- ✅ Runs in real browser (Chromium)
- ✅ Real browser APIs (no polyfills)
- ✅ Native browser events
- ✅ Faster than E2E tests
- ✅ Isolated component testing
- ⚠️ Slower than unit tests

**Example:**

```typescript
// src/features/users/components/user-card.test.tsx
import { test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '~/test'
import { UserCard } from './user-card'

test('displays user information', () => {
  renderWithProviders(
    <UserCard name="John Doe" email="john@example.com" />
  )

  expect(screen.getByText('John Doe')).toBeInTheDocument()
  expect(screen.getByText('john@example.com')).toBeInTheDocument()
})
```

**Location:** Colocate with source files using `.test.tsx` suffix

**Run with:** `bun run test` (runs all tests including component tests)

---

### E2E Tests (Playwright)

**Use for:**

- Complete user flows across multiple pages
- Authentication flows (login, logout, registration)
- Multi-step processes (checkout, onboarding)
- Critical business workflows
- Cross-page navigation
- Full application integration

**Characteristics:**

- ✅ Tests entire application
- ✅ Real user perspective
- ✅ Catches integration issues
- ✅ Multiple browser support
- ✅ Automatic screenshots/videos on failure
- ⚠️ Slowest tests
- ⚠️ More brittle than unit/component tests

**Example:**

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can login and logout', async ({ page }) => {
	await page.goto('/login')

	await page.getByLabel(/email/i).fill('admin@example.com')
	await page.getByLabel(/password/i).fill('password123')
	await page.getByRole('button', { name: /log in/i }).click()

	await expect(page).toHaveURL(/\/admin\/dashboard/)

	await page.getByRole('button', { name: /logout/i }).click()
	await expect(page).toHaveURL(/\/login/)
})
```

**Location:** Dedicated `e2e/` directory

**Run with:** `bun run test:e2e`

---

## Decision Tree: Which Test Type?

```
Does it involve the DOM or React?
│
├─ NO → Unit Test
│       (Pure functions, utilities, business logic)
│
└─ YES → Does it test a complete user flow across pages?
         │
         ├─ YES → E2E Test
         │        (Login flow, checkout process, multi-page workflows)
         │
         └─ NO → Component Test
                  (Single component, user interactions, rendering)
```

## Quick Reference Table

| Test Type     | Environment | Speed       | Scope           | Use For                 |
| ------------- | ----------- | ----------- | --------------- | ----------------------- |
| **Unit**      | Node.js     | ⚡⚡⚡ Fast | Function/Module | Pure logic, utilities   |
| **Component** | Browser     | ⚡⚡ Medium | Component       | React components, hooks |
| **E2E**       | Browser     | ⚡ Slow     | Application     | User flows, integration |

## Testing Best Practices

### General Principles

1. **Test behavior, not implementation**
   - Focus on what users see and do
   - Avoid testing internal state or private methods
   - Test the public API

2. **Write descriptive test names**
   - Explain what is being tested
   - Include expected behavior
   - Make failures easy to understand

3. **Keep tests independent**
   - Each test should work in isolation
   - Don't rely on test execution order
   - Clean up resources properly

4. **Use factories for test data**
   - Consistent, valid test data
   - Easy to override specific fields
   - Reduces test boilerplate

5. **Follow AAA pattern**
   - **Arrange**: Set up test data and conditions
   - **Act**: Execute the code being tested
   - **Assert**: Verify the results

### Unit Test Best Practices

```typescript
// ✅ GOOD: Descriptive name, focused test
test('formatCurrency formats USD with commas and decimals', () => {
	expect(formatCurrency(1234.56)).toBe('$1,234.56')
})

// ❌ BAD: Vague name, multiple assertions
test('format works', () => {
	expect(formatCurrency(1234.56)).toBe('$1,234.56')
	expect(formatDate(new Date())).toBeTruthy()
	expect(formatName('john')).toBe('John')
})
```

### Component Test Best Practices

```typescript
// ✅ GOOD: Uses semantic queries, tests user behavior
test('submits form when user clicks submit button', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()

  renderWithProviders(<LoginForm onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
})

// ❌ BAD: Tests implementation details, uses CSS selectors
test('form works', () => {
  const { container } = render(<LoginForm />)
  const input = container.querySelector('.email-input')
  fireEvent.change(input, { target: { value: 'test@example.com' } })
  expect(input.value).toBe('test@example.com')
})
```

### E2E Test Best Practices

```typescript
// ✅ GOOD: Tests complete flow, uses semantic selectors
test('user can complete checkout process', async ({ page }) => {
	await page.goto('/products')
	await page
		.getByRole('button', { name: /add to cart/i })
		.first()
		.click()
	await page.getByRole('link', { name: /cart/i }).click()
	await page.getByRole('button', { name: /checkout/i }).click()
	await page.getByLabel(/card number/i).fill('4242424242424242')
	await page.getByRole('button', { name: /pay/i }).click()
	await expect(page.getByText(/order confirmed/i)).toBeVisible()
})

// ❌ BAD: Tests individual pages separately, brittle selectors
test('cart page shows items', async ({ page }) => {
	await page.goto('/cart')
	expect(await page.locator('#cart-items').count()).toBeGreaterThan(0)
})
```

## Common Testing Patterns

### Testing with React Query

```typescript
test('displays data from API', async () => {
  const { queryClient } = renderWithProviders(<UserList />)

  // Mock API response
  queryClient.setQueryData(['users'], [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ])

  expect(screen.getByText('John')).toBeInTheDocument()
  expect(screen.getByText('Jane')).toBeInTheDocument()
})
```

### Testing with Zustand

```typescript
test('updates store state', () => {
	const { result } = renderHook(() => useUIStore())

	act(() => {
		result.current.toggleSidebar()
	})

	expect(result.current.sidebarOpen).toBe(false)
})
```

### Testing Async Behavior

```typescript
test('shows loading state then data', async () => {
  renderWithProviders(<UserList />)

  // Initially shows loading
  expect(screen.getByText(/loading/i)).toBeInTheDocument()

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  // Loading state is gone
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
})
```

### Testing Error States

```typescript
test('displays error message on failure', async () => {
  // Mock API to return error
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json({ error: 'Failed to load' }, { status: 500 })
    })
  )

  renderWithProviders(<UserList />)

  await waitFor(() => {
    expect(screen.getByText(/error loading users/i)).toBeInTheDocument()
  })
})
```

### Using Disposable Resources

```typescript
test('makes request to test server', async () => {
	// Server is automatically cleaned up when test ends
	await using server = await createTestServer()

	const response = await fetch(server.url)
	expect(response.ok).toBe(true)
})
```

## Test Organization

### File Structure

```
src/
├── features/
│   └── users/
│       ├── components/
│       │   ├── user-card.tsx
│       │   └── user-card.test.tsx          # Component test
│       └── utils/
│           ├── format-user.ts
│           └── format-user.test.ts         # Unit test
├── test/
│   ├── setup.ts                            # Test configuration
│   ├── factories.ts                        # Test data factories
│   ├── disposables.ts                      # Disposable resources
│   ├── render-utils.tsx                    # Render utilities
│   └── examples/                           # Example tests
│       ├── component-test.example.test.tsx
│       ├── unit-test.example.test.ts
│       └── e2e-test.example.spec.ts
└── e2e/
    ├── auth.spec.ts                        # E2E test
    └── user-management.spec.ts             # E2E test
```

### Naming Conventions

- **Unit tests**: `*.test.ts`
- **Component tests**: `*.test.tsx`
- **E2E tests**: `*.spec.ts`
- **Test utilities**: `src/test/`
- **E2E tests**: `e2e/`

## Running Tests

### Run All Tests

```bash
bun run test
```

### Run Tests in Watch Mode

```bash
bun run test
# (Vitest runs in watch mode by default)
```

### Run Tests Once (CI Mode)

```bash
bun run test --run
```

### Run Specific Test File

```bash
bun run test -- user-card.test.tsx
```

### Run E2E Tests

```bash
bun run test:e2e
```

### Run E2E Tests in UI Mode

```bash
bun run test:e2e --ui
```

### Run Tests with Coverage

```bash
bun run test --coverage
```

## Debugging Tests

### Component Tests

```typescript
test('debug component', () => {
  const { debug } = renderWithProviders(<UserCard name="John" />)

  // Print current DOM
  debug()

  // Print specific element
  debug(screen.getByText('John'))
})
```

### E2E Tests

```typescript
test('debug E2E test', async ({ page }) => {
	// Run in headed mode to see browser
	// Add to playwright.config.ts: headless: false

	// Pause execution
	await page.pause()

	// Take screenshot
	await page.screenshot({ path: 'debug.png' })
})
```

## Common Issues and Solutions

### Issue: Tests fail in CI but pass locally

**Solution**: Ensure headless mode is enabled in CI:

```typescript
// vitest.config.ts
browser: {
	headless: process.env.CI === 'true'
}
```

### Issue: Component tests can't find elements

**Solution**: Use `waitFor` for async elements:

```typescript
await waitFor(() => {
	expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### Issue: E2E tests are flaky

**Solution**: Use Playwright's auto-waiting:

```typescript
// ✅ GOOD: Playwright waits automatically
await page.getByText('Submit').click()

// ❌ BAD: Manual timeout
await page.waitForTimeout(1000)
```

### Issue: Tests are slow

**Solution**:

1. Use unit tests for logic (fastest)
2. Use component tests for UI (medium)
3. Use E2E tests only for critical flows (slowest)
4. Run tests in parallel (enabled by default)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Example Tests](./examples/)
- [Disposable Pattern Guide](./DISPOSABLES.md)

## Summary

- **Unit Tests**: Fast, focused, for pure logic
- **Component Tests**: Medium speed, for React components
- **E2E Tests**: Slow, comprehensive, for user flows
- Use the right test type for the right job
- Follow best practices for reliable tests
- Keep tests independent and maintainable
