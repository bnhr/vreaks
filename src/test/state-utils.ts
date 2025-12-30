/**
 * State management testing utilities
 * Provides helpers for testing React Query and Zustand state
 */

import { QueryClient, type QueryKey } from '@tanstack/react-query'
import { renderHook, type RenderHookResult } from '@testing-library/react'
import type { StoreApi } from 'zustand'

/**
 * Options for mocking API responses
 */
export interface MockApiResponseOptions {
	/**
	 * HTTP status code for the response
	 * @default 200
	 */
	status?: number

	/**
	 * Delay in milliseconds before resolving the response
	 * @default 0
	 */
	delay?: number

	/**
	 * Whether to reject the promise (simulate error)
	 * @default false
	 */
	shouldError?: boolean
}

/**
 * Mock an API response for React Query testing
 *
 * This function sets query data directly in the QueryClient cache,
 * simulating a successful API response without making actual network requests.
 *
 * @example
 * ```typescript
 * const queryClient = createTestQueryClient()
 *
 * // Mock a successful response
 * mockApiResponse(queryClient, ['users', '123'], { id: '123', name: 'John' })
 *
 * // Mock with delay
 * await mockApiResponse(
 *   queryClient,
 *   ['users'],
 *   [{ id: '1', name: 'Alice' }],
 *   { delay: 100 }
 * )
 *
 * // Mock an error
 * await mockApiResponse(
 *   queryClient,
 *   ['users', '999'],
 *   null,
 *   { shouldError: true, status: 404 }
 * )
 * ```
 */
export async function mockApiResponse<T>(
	queryClient: QueryClient,
	queryKey: QueryKey,
	data: T,
	options: MockApiResponseOptions = {},
): Promise<void> {
	const { status = 200, delay = 0, shouldError = false } = options

	// Apply delay if specified
	if (delay > 0) {
		await new Promise((resolve) => setTimeout(resolve, delay))
	}

	if (shouldError) {
		// Set error state in the cache
		queryClient.setQueryData(queryKey, () => {
			throw new Error(`API Error: ${status}`)
		})
	} else {
		// Set successful data in the cache
		queryClient.setQueryData(queryKey, data)
	}
}

/**
 * Wait for a React Query query to complete (either success or error)
 *
 * This utility polls the query state until it's no longer loading,
 * or until the timeout is reached.
 *
 * @example
 * ```typescript
 * const queryClient = createTestQueryClient()
 *
 * // Trigger a query
 * queryClient.fetchQuery({ queryKey: ['users'], queryFn: fetchUsers })
 *
 * // Wait for it to complete
 * await waitForQuery(queryClient, ['users'])
 *
 * // Now you can assert on the result
 * const data = queryClient.getQueryData(['users'])
 * expect(data).toBeDefined()
 * ```
 */
export async function waitForQuery(
	queryClient: QueryClient,
	queryKey: QueryKey,
	options: { timeout?: number } = {},
): Promise<void> {
	const { timeout = 5000 } = options
	const startTime = Date.now()

	return new Promise((resolve, reject) => {
		const checkQuery = () => {
			const query = queryClient.getQueryState(queryKey)

			// Check if we've exceeded the timeout
			if (Date.now() - startTime > timeout) {
				reject(
					new Error(`Timeout waiting for query: ${JSON.stringify(queryKey)}`),
				)
				return
			}

			// If query doesn't exist yet, keep waiting
			if (!query) {
				setTimeout(checkQuery, 50)
				return
			}

			// If query is still fetching, keep waiting
			if (query.fetchStatus === 'fetching') {
				setTimeout(checkQuery, 50)
				return
			}

			// Query has completed (either success or error)
			resolve()
		}

		checkQuery()
	})
}

/**
 * Render a hook with a Zustand store for testing
 *
 * This utility wraps renderHook to provide a store instance
 * that can be inspected and manipulated during tests.
 *
 * @example
 * ```typescript
 * const { result, store } = renderHookWithStore(
 *   () => useUserStore(),
 *   userStore
 * )
 *
 * // Access hook result
 * expect(result.current.users).toEqual([])
 *
 * // Manipulate store directly
 * act(() => {
 *   store.setState({ users: [{ id: '1', name: 'Alice' }] })
 * })
 *
 * expect(result.current.users).toHaveLength(1)
 * ```
 */
export function renderHookWithStore<T, S>(
	hook: () => T,
	store?: StoreApi<S>,
): RenderHookResult<T, unknown> & { store?: StoreApi<S> } {
	const result = renderHook(hook)

	return {
		...result,
		store,
	}
}

/**
 * Registry of Zustand stores for cleanup
 */
const storeRegistry = new Set<StoreApi<unknown>>()

/**
 * Register a Zustand store for automatic cleanup
 *
 * Call this in your store creation to enable automatic reset between tests.
 *
 * @example
 * ```typescript
 * export const useUserStore = create<UserState>((set) => ({
 *   users: [],
 *   addUser: (user) => set((state) => ({ users: [...state.users, user] })),
 * }))
 *
 * // Register for cleanup
 * registerStore(useUserStore)
 * ```
 */
export function registerStore<S>(store: StoreApi<S>): void {
	storeRegistry.add(store as StoreApi<unknown>)
}

/**
 * Reset all registered Zustand stores to their initial state
 *
 * This should be called in afterEach or beforeEach hooks to ensure
 * test isolation. It resets all stores that have been registered
 * using registerStore().
 *
 * @example
 * ```typescript
 * import { afterEach } from 'vitest'
 * import { resetAllStores } from '~/test'
 *
 * afterEach(() => {
 *   resetAllStores()
 * })
 * ```
 */
export function resetAllStores(): void {
	storeRegistry.forEach((store) => {
		// Get the initial state by creating a new store instance
		// This is a common pattern for Zustand store reset
		const initialState = store.getInitialState?.() ?? store.getState()
		store.setState(initialState, true)
	})
}

/**
 * Clear the store registry
 * Useful for testing the utilities themselves
 */
export function clearStoreRegistry(): void {
	storeRegistry.clear()
}
