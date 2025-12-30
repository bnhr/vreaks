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

## Creating Disposable Resources

### Generic Disposable Wrapper

Use `createDisposable` to wrap any resource with cleanup logic:

```typescript
import { createDisposable } from '~/test/disposables'

// Create a disposable wrapper
const disposableResource = createDisposable(
	resource, // The resource to wrap
	async (resource) => {
		// Cleanup function
		await resource.cleanup()
	},
)
```

### Example: Disposable Test Server

```typescript
import { createDisposable } from '~/test/disposables'
import http from 'http'

export async function createTestServer() {
	const server = http.createServer((req, res) => {
		res.writeHead(200, { 'Content-Type': 'text/plain' })
		res.end('Test server response')
	})

	// Find available port
	const port = await getAvailablePort()

	// Start server
	await new Promise<void>((resolve) => {
		server.listen(port, () => resolve())
	})

	const url = `http://localhost:${port}`

	// Wrap with disposable
	return createDisposable({ server, url, port }, async ({ server }) => {
		await new Promise<void>((resolve, reject) => {
			server.close((err) => {
				if (err) reject(err)
				else resolve()
			})
		})
	})
}
```

### Example: Disposable Database Connection

```typescript
import { createDisposable } from '~/test/disposables'
import { createConnection } from 'some-db-library'

export async function createTestDatabase() {
	// Create in-memory database
	const db = await createConnection(':memory:')

	// Run migrations
	await db.migrate()

	// Wrap with disposable
	return createDisposable(db, async (db) => {
		await db.close()
	})
}
```

### Example: Disposable Temporary File

```typescript
import { createDisposable } from '~/test/disposables'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

export async function createTempFile(content: string) {
	const tempDir = os.tmpdir()
	const filePath = path.join(tempDir, `test-${Date.now()}.txt`)

	// Create file
	await fs.writeFile(filePath, content, 'utf-8')

	// Wrap with disposable
	return createDisposable({ path: filePath, content }, async ({ path }) => {
		await fs.unlink(path)
	})
}
```

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

### Conditional Cleanup

```typescript
test('conditionally creates resources', async () => {
	const needsServer = true

	if (needsServer) {
		await using server = await createTestServer()
		// Use server
	}

	// Server is cleaned up when if block exits
})
```

## Advanced Patterns

### Disposable with Multiple Resources

```typescript
export async function createTestEnvironment() {
	const server = await startServer()
	const db = await createDatabase()
	const cache = await createCache()

	return createDisposable(
		{ server, db, cache },
		async ({ server, db, cache }) => {
			// Clean up in reverse order
			await cache.close()
			await db.close()
			await server.close()
		},
	)
}

test('uses complete test environment', async () => {
	await using env = await createTestEnvironment()

	// Use env.server, env.db, env.cache
})
```

### Disposable Factory

```typescript
export function createDisposableFactory<T>(
	create: () => Promise<T>,
	cleanup: (resource: T) => Promise<void>,
) {
	return async () => {
		const resource = await create()
		return createDisposable(resource, cleanup)
	}
}

// Create reusable disposable factories
const createTestUser = createDisposableFactory(
	async () => {
		const user = await db.users.create({ name: 'Test User' })
		return user
	},
	async (user) => {
		await db.users.delete(user.id)
	},
)

test('uses disposable factory', async () => {
	await using user = await createTestUser()
	// User is automatically deleted after test
})
```

### Nested Disposables

```typescript
test('uses nested disposable resources', async () => {
	await using server = await createTestServer()

	// Create nested scope
	{
		await using tempFile = await createTempFile('data')
		// Use tempFile
	} // tempFile cleaned up here

	// server still available
	await fetch(server.url)

	// server cleaned up here
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
return createDisposable(resource, async (r) => await r.close())

// ❌ WRONG - complex cleanup logic
return createDisposable(resource, async (r) => {
	// Too much logic in cleanup
	await doComplexThing()
	await doAnotherThing()
	await r.close()
})
```

### 4. Handle Cleanup Errors

```typescript
return createDisposable(resource, async (r) => {
	try {
		await r.close()
	} catch (error) {
		// Log but don't throw - cleanup errors shouldn't fail tests
		console.warn('Cleanup error:', error)
	}
})
```

### 5. Document Disposable Resources

````typescript
/**
 * Creates a disposable test server.
 *
 * The server is automatically closed when the disposable goes out of scope.
 *
 * @example
 * ```typescript
 * test('example', async () => {
 *   await using server = await createTestServer()
 *   await fetch(server.url)
 * })
 * ```
 */
export async function createTestServer() {
	// Implementation
}
````

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

### Mock Services

```typescript
test('test with mock service', async () => {
	await using mockApi = await createMockApiServer({
		'/users': { data: [{ id: 1, name: 'Test' }] },
	})

	const response = await fetch(`${mockApi.url}/users`)
	const data = await response.json()
	expect(data.data).toHaveLength(1)
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

### Cleanup Errors Failing Tests

**Problem**: Errors during cleanup cause tests to fail.

**Solution**: Catch and log cleanup errors instead of throwing:

```typescript
return createDisposable(resource, async (r) => {
	try {
		await r.close()
	} catch (error) {
		console.warn('Cleanup error:', error)
	}
})
```

## Summary

The disposable pattern provides:

- ✅ Automatic resource cleanup
- ✅ Error-safe cleanup
- ✅ Less boilerplate code
- ✅ Prevention of resource leaks
- ✅ Better test reliability

Use disposables for any resource that needs cleanup in tests. They make tests more reliable, easier to write, and easier to maintain.
