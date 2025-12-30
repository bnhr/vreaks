# Testing Quick Reference

A quick reference guide for writing tests in this project.

## Test Types at a Glance

| Type          | Tool             | Speed  | Use For                   | Location        |
| ------------- | ---------------- | ------ | ------------------------- | --------------- |
| **Unit**      | Vitest (Node)    | ⚡⚡⚡ | Pure functions, utilities | `*.test.ts`     |
| **Component** | Vitest (Browser) | ⚡⚡   | React components, hooks   | `*.test.tsx`    |
| **E2E**       | Playwright       | ⚡     | User flows, integration   | `e2e/*.spec.ts` |

## Quick Decision Guide

```
Need to test?
│
├─ Pure function/utility? → Unit Test
├─ React component? → Component Test
└─ Multi-page flow? → E2E Test
```

## Common Commands

```bash
# Run all tests
bun run test

# Run tests once (CI)
bun run test --run

# Run E2E tests
bun run test:e2e

# Run specific test
bun run test -- user-card.test.tsx

# Run with coverage
bun run test --coverage
```

## Unit Test Template

```typescript
import { test, expect } from 'vitest'

test('descriptive test name', () => {
	// Arrange
	const input = 'test'

	// Act
	const result = myFunction(input)

	// Assert
	expect(result).toBe('expected')
})
```

## Component Test Template

```typescript
import { test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderWithProviders } from '~/test'

test('descriptive test name', async () => {
  // Arrange
  const user = userEvent.setup()
  renderWithProviders(<MyComponent />)

  // Act
  await user.click(screen.getByRole('button'))

  // Assert
  expect(screen.getByText('Result')).toBeInTheDocument()
})
```

## E2E Test Template

```typescript
import { test, expect } from '@playwright/test'

test('descriptive test name', async ({ page }) => {
	// Arrange
	await page.goto('/page')

	// Act
	await page.getByRole('button').click()

	// Assert
	await expect(page.getByText('Result')).toBeVisible()
})
```

## Test Utilities Cheat Sheet

### Factories

```typescript
import { userFactory, authFactory } from '~/test'

// Single item
const user = userFactory.build({ role: 'admin' })

// Multiple items
const users = userFactory.buildList(5)

// With overrides
const admin = userFactory.build({ role: 'admin', premium: true })
```

### Disposables

```typescript
import { createTestServer } from '~/test'

test('with disposable', async () => {
	await using server = await createTestServer()
	// Use server.url
	// Automatic cleanup!
})
```

### Render Utilities

```typescript
import { renderWithProviders } from '~/test'

const { queryClient } = renderWithProviders(<Component />)
```

### State Utilities

```typescript
import { mockApiResponse, waitForQuery, resetAllStores } from '~/test'

// Mock API
await mockApiResponse(queryClient, ['users'], [{ id: 1 }])

// Wait for query
await waitForQuery(queryClient, ['users'])

// Reset stores
resetAllStores()
```

## Common Queries (Testing Library)

```typescript
// By role (preferred)
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })

// By label
screen.getByLabelText(/email/i)

// By text
screen.getByText(/hello world/i)

// By placeholder
screen.getByPlaceholderText(/search/i)

// Query variants
screen.getByText() // Throws if not found
screen.queryByText() // Returns null if not found
screen.findByText() // Async, waits for element
```

## Common Playwright Selectors

```typescript
// By role (preferred)
page.getByRole('button', { name: /submit/i })

// By label
page.getByLabel(/email/i)

// By text
page.getByText(/hello world/i)

// By placeholder
page.getByPlaceholder(/search/i)

// By test ID
page.getByTestId('submit-button')
```

## Waiting Patterns

### Component Tests

```typescript
import { waitFor } from '@testing-library/react'

// Wait for element
await waitFor(() => {
	expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// Wait for query
await waitForQuery(queryClient, ['users'])
```

### E2E Tests

```typescript
// Playwright auto-waits for most actions
await page.getByText('Submit').click()

// Explicit wait
await expect(page.getByText('Success')).toBeVisible()
```

## Best Practices Checklist

- [ ] Use semantic queries (getByRole, getByLabel)
- [ ] Test user behavior, not implementation
- [ ] Use factories for test data
- [ ] Use disposables for resources
- [ ] Keep tests independent
- [ ] Write descriptive test names
- [ ] Use async/await for user interactions
- [ ] Mock at API level, not internals
- [ ] Reset state between tests

## Common Mistakes to Avoid

❌ **Don't use CSS selectors**

```typescript
container.querySelector('.button') // BAD
```

✅ **Use semantic queries**

```typescript
screen.getByRole('button') // GOOD
```

---

❌ **Don't test implementation details**

```typescript
expect(component.state.count).toBe(1) // BAD
```

✅ **Test user-visible behavior**

```typescript
expect(screen.getByText('Count: 1')).toBeInTheDocument() // GOOD
```

---

❌ **Don't forget await with userEvent**

```typescript
user.click(button) // BAD - missing await
```

✅ **Always await user interactions**

```typescript
await user.click(button) // GOOD
```

---

❌ **Don't use arbitrary timeouts**

```typescript
await page.waitForTimeout(1000) // BAD
```

✅ **Use proper waiting**

```typescript
await expect(page.getByText('Loaded')).toBeVisible() // GOOD
```

## Resources

- [Full Testing Guide](./TESTING-GUIDE.md)
- [Disposables Guide](./DISPOSABLES.md)
- [Example Tests](./examples/)
- [Test Utilities README](./README.md)

## Need Help?

1. Check the [Testing Guide](./TESTING-GUIDE.md) for detailed explanations
2. Look at [example tests](./examples/) for patterns
3. Review [test utilities](./README.md) for available helpers
4. Read the [Disposables Guide](./DISPOSABLES.md) for resource cleanup
