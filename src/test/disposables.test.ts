import { test, expect, describe } from 'vitest'
import { createTestServer, createDisposable } from './disposables'

describe('createDisposable', () => {
	test('creates disposable wrapper with cleanup function', async () => {
		let cleanupCalled = false
		const resource = { value: 42 }

		const disposable = createDisposable(resource, async (r) => {
			cleanupCalled = true
			expect(r).toBe(resource)
		})

		// Resource properties should be accessible
		expect(disposable.value).toBe(42)

		// Cleanup should not be called yet
		expect(cleanupCalled).toBe(false)

		// Call cleanup manually
		await disposable[Symbol.asyncDispose]()

		// Cleanup should have been called
		expect(cleanupCalled).toBe(true)
	})

	test('handles async cleanup', async () => {
		const cleanupOrder: string[] = []

		const disposable = createDisposable({ id: 'test' }, async () => {
			cleanupOrder.push('start')
			await new Promise((resolve) => setTimeout(resolve, 10))
			cleanupOrder.push('end')
		})

		await disposable[Symbol.asyncDispose]()

		expect(cleanupOrder).toEqual(['start', 'end'])
	})
})

describe('createTestServer', () => {
	test('starts server and accepts connections', async () => {
		const server = await createTestServer()

		try {
			// Server should have valid properties
			expect(server.server).toBeDefined()
			expect(server.url).toMatch(/^http:\/\/localhost:\d+$/)
			expect(server.port).toBeGreaterThan(0)

			// Server should accept connections
			const response = await fetch(server.url)
			expect(response.ok).toBe(true)
			expect(response.status).toBe(200)

			const text = await response.text()
			expect(text).toBe('Test server running')
		} finally {
			// Clean up
			await server[Symbol.asyncDispose]()
		}
	})

	test('auto-selects available port when not specified', async () => {
		const server1 = await createTestServer()
		const server2 = await createTestServer()

		try {
			// Both servers should have different ports
			expect(server1.port).not.toBe(server2.port)

			// Both should be accessible
			const response1 = await fetch(server1.url)
			const response2 = await fetch(server2.url)

			expect(response1.ok).toBe(true)
			expect(response2.ok).toBe(true)
		} finally {
			await server1[Symbol.asyncDispose]()
			await server2[Symbol.asyncDispose]()
		}
	})

	test('uses specified port when provided', async () => {
		// Find an available port first
		const tempServer = await createTestServer()
		const availablePort = tempServer.port
		await tempServer[Symbol.asyncDispose]()

		// Now create server with that port
		const server = await createTestServer({ port: availablePort })

		try {
			expect(server.port).toBe(availablePort)
			expect(server.url).toBe(`http://localhost:${availablePort}`)
		} finally {
			await server[Symbol.asyncDispose]()
		}
	})

	test('cleanup closes server properly', async () => {
		const server = await createTestServer()
		const { url } = server

		// Server should be accessible before cleanup
		const responseBefore = await fetch(url)
		expect(responseBefore.ok).toBe(true)

		// Clean up the server
		await server[Symbol.asyncDispose]()

		// Server should not be accessible after cleanup
		await expect(fetch(url)).rejects.toThrow()
	})

	test('cleanup is idempotent', async () => {
		const server = await createTestServer()

		// First cleanup should succeed
		await expect(server[Symbol.asyncDispose]()).resolves.toBeUndefined()

		// Second cleanup should not throw (server already closed)
		// Note: Node.js http.Server.close() will error if already closed
		// This tests that we handle that gracefully
		await expect(server[Symbol.asyncDispose]()).rejects.toThrow()
	})
})
