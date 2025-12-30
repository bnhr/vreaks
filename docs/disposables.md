# Disposable Pattern Guide

The disposable pattern provides automatic resource cleanup in tests using TypeScript's `Symbol.asyncDispose` feature. This ensures resources are properly cleaned up even when tests fail, preventing resource leaks and test pollution.

## What are Disposables?

Disposables are objects that implement the `Symbol.asyncDispose` interface, which allows them to be used with the `using` keyword for automatic cleanup. When a disposable object goes out of scope, its cleanup method is automatically called.

```typescript
interface AsyncDisposable {
  [Symbol.asyncDispose](): Promise<void>
}
```

## Why Use Disposables?

**Without Disposables:**
```typescript
test('example test', async () => {
  const server = await startTestServer()
  
  try {
    // Test code here
    await doSomething()
  } finally {
    // Must remember to clean up
    await server.close()
  }
})
```

**With Disposables:**
```typescript
test('example test', async () => {
  await using server = await createTestServer()
  
  // Test code here
  await doSomething()
  
  // Cleanup happens automatically!
})
```

## Benefits

1. **Automatic Cleanup**: Resources are cleaned up automatically when scope exits
2. **Error Safety**: Cleanup happens even if test throws an error
3. **Less Boilerplate**: No need for try/finally blocks
4. **Prevents Leaks**: Impossible to forget cleanup
5. **Better Readability**: Test code focuses on behavior, not cleanup

## Using Disposables in Tests

### Basic Usage

```typescript
import { test, expect } from 'vitest'
import { createTestServer } from '~/test/disposables'

test('makes request to test server', async () => {
  // Create disposable server with 'await using'
  await using server = await createTestServer()

  // Use the server
  const response = await fetch(server.url)
  const text = await response.text()

  expect(text).toBe('Test server response')

  // Server is automatically closed when test ends
})
```

### Multiple Disposables

```typescript
test('uses multiple disposable resources', async () => {
  await using server = await createTestServer()
  await using db = await createTestDatabase()
  await using tempFile = await createTempFile('test data')

  // Use all resources
  const response = await fetch(server.url)
  const users = await db.query('SELECT * FROM users')
  const fileContent = await fs.readFile(tempFile.path, 'utf-8')

  // All resources are automatically cleaned up
})
```

### Cleanup on Error

```typescript
test('cleans up even when test fails', async () => {
  await using server = await createTestServer()

  // Even if this throws an error...
  throw new Error('Test failed!')

  // ...the server is still cleaned up automatically
})
```

## Best Practices

### 1. Always Use `await using`

```typescript
// ✅ CORRECT
await using server = await createTestServer()

// ❌ WRONG - cleanup won't happen
const server = await createTestServer()
```

### 2. Create Disposables for All Resources

Any resource that needs cleanup should be a disposable:
- Network servers
- Database connections
- File handles
- Temporary files
- Mock services
- WebSocket connections

### 3. Keep Cleanup Simple

```typescript
// ✅ CORRECT - simple cleanup
return createDisposable(
  resource,
  async (r) => await r.close()
)

// ❌ WRONG - complex cleanup logic
return createDisposable(
  resource,
  async (r) => {
    // Too much logic in cleanup
    await doComplexThing()
    await doAnotherThing()
    await r.close()
  }
)
```

## Common Patterns

### Test Server

```typescript
test('test with server', async () => {
  await using server = await createTestServer()
  const response = await fetch(`${server.url}/api/data`)
  expect(response.ok).toBe(true)
})
```

### Database Connection

```typescript
test('test with database', async () => {
  await using db = await createTestDatabase()
  await db.users.create({ name: 'Test' })
  const users = await db.users.findAll()
  expect(users).toHaveLength(1)
})
```

### Temporary Files

```typescript
test('test with temp file', async () => {
  await using file = await createTempFile('test content')
  const content = await fs.readFile(file.path, 'utf-8')
  expect(content).toBe('test content')
})
```

## Troubleshooting

### Cleanup Not Running

**Problem**: Cleanup function is not being called.

**Solution**: Make sure you're using `await using`, not just `const`:

```typescript
// ✅ CORRECT
await using server = await createTestServer()

// ❌ WRONG
const server = await createTestServer()
```

### TypeScript Errors

**Problem**: TypeScript doesn't recognize `Symbol.asyncDispose`.

**Solution**: Ensure you're using TypeScript 5.2+ and have the correct target in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"]
  }
}
```

## Summary

The disposable pattern provides:
- ✅ Automatic resource cleanup
- ✅ Error-safe cleanup
- ✅ Less boilerplate code
- ✅ Prevention of resource leaks
- ✅ Better test reliability

Use disposables for any resource that needs cleanup in tests. They make tests more reliable, easier to write, and easier to maintain.
