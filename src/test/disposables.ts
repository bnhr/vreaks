/**
 * Disposable resource utilities for automatic cleanup
 * Implements the TypeScript disposable pattern (Symbol.asyncDispose)
 */

import http from 'node:http'
import { AddressInfo } from 'node:net'

/**
 * Async disposable interface for automatic resource cleanup
 */
export interface AsyncDisposable {
	[Symbol.asyncDispose](): Promise<void>
}

/**
 * Generic disposable wrapper that adds cleanup logic to any resource
 *
 * @example
 * ```typescript
 * const server = createDisposable(
 *   httpServer,
 *   async (s) => {
 *     await new Promise<void>((resolve) => s.close(() => resolve()))
 *   }
 * )
 *
 * // Use with 'using' keyword (TypeScript 5.2+)
 * await using server = createTestServer()
 * // Server automatically cleaned up when scope exits
 * ```
 */
export function createDisposable<T extends object>(
	resource: T,
	cleanup: (resource: T) => Promise<void>,
): AsyncDisposable & T {
	return {
		...resource,
		async [Symbol.asyncDispose]() {
			await cleanup(resource)
		},
	}
}

/**
 * Test server configuration
 */
export interface TestServerConfig {
	port?: number
	host?: string
}

/**
 * Test server resource with automatic cleanup
 */
export interface TestServer extends AsyncDisposable {
	server: http.Server
	url: string
	port: number
}

/**
 * Find an available port by creating a temporary server on port 0
 */
async function getAvailablePort(): Promise<number> {
	return new Promise((resolve, reject) => {
		const tempServer = http.createServer()
		tempServer.listen(0, () => {
			const address = tempServer.address() as AddressInfo
			const port = address.port
			tempServer.close(() => resolve(port))
		})
		tempServer.on('error', reject)
	})
}

/**
 * Create a disposable test server that automatically cleans up
 *
 * The server will automatically select an available port if none is specified.
 * When the disposable goes out of scope, the server is automatically closed.
 *
 * @example
 * ```typescript
 * await using server = await createTestServer()
 * // Make requests to server.url
 * // Server automatically closes when scope exits
 * ```
 */
export async function createTestServer(
	config?: TestServerConfig,
): Promise<TestServer> {
	const host = config?.host || 'localhost'

	// Auto-select available port if not specified
	const port = config?.port || (await getAvailablePort())

	// Create a simple HTTP server that responds with 200 OK
	const server = http.createServer((_req, res) => {
		res.writeHead(200, { 'Content-Type': 'text/plain' })
		res.end('Test server running')
	})

	// Start the server
	await new Promise<void>((resolve, reject) => {
		server.listen(port, host, () => resolve())
		server.on('error', reject)
	})

	const url = `http://${host}:${port}`

	return {
		server,
		url,
		port,
		async [Symbol.asyncDispose]() {
			// Close the server and wait for it to finish
			await new Promise<void>((resolve, reject) => {
				server.close((err) => {
					if (err) reject(err)
					else resolve()
				})
			})
		},
	}
}

/**
 * Test database configuration
 */
export interface TestDatabaseConfig {
	name?: string
	reset?: boolean
}

/**
 * Test database resource with automatic cleanup
 */
export interface TestDatabase extends AsyncDisposable {
	db: unknown // Will be typed based on actual database client
	name: string
}

/**
 * Create a disposable test database that automatically cleans up
 *
 * Note: This is a placeholder for future database testing needs.
 * Implementation will depend on the database technology used.
 *
 * @example
 * ```typescript
 * await using db = await createTestDatabase({ name: 'test-db' })
 * // Use db.db for database operations
 * // Database automatically cleaned up when scope exits
 * ```
 */
export async function createTestDatabase(
	config?: TestDatabaseConfig,
): Promise<TestDatabase> {
	// Placeholder implementation for future use
	const name = config?.name || `test-db-${Date.now()}`
	const db = null as unknown

	return {
		db,
		name,
		async [Symbol.asyncDispose]() {
			// Cleanup logic will be implemented when database testing is needed
			// Will close connections and optionally drop test database
		},
	}
}

/**
 * Cleanup helper for multiple disposable resources
 * Ensures all resources are cleaned up even if some fail
 */
export async function cleanupAll(
	disposables: AsyncDisposable[],
): Promise<void> {
	const errors: Error[] = []

	for (const disposable of disposables) {
		try {
			await disposable[Symbol.asyncDispose]()
		} catch (error) {
			errors.push(error instanceof Error ? error : new Error(String(error)))
		}
	}

	if (errors.length > 0) {
		const message = errors.map((e) => e.message).join('; ')
		throw new Error(
			`Cleanup failed for ${errors.length} resource(s): ${message}`,
		)
	}
}
