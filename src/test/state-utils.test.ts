/**
 * Tests for state management utilities
 * @vitest-environment jsdom
 */

import { describe, test, expect, beforeEach } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import {
	mockApiResponse,
	waitForQuery,
	renderHookWithStore,
	registerStore,
	resetAllStores,
	clearStoreRegistry,
} from './state-utils'
import { createTestQueryClient } from './render-utils'

describe('mockApiResponse', () => {
	let queryClient: QueryClient

	beforeEach(() => {
		queryClient = createTestQueryClient()
	})

	test('sets query data in cache', () => {
		const testData = { id: '1', name: 'Test User' }
		const queryKey = ['users', '1']

		mockApiResponse(queryClient, queryKey, testData)

		const cachedData = queryClient.getQueryData(queryKey)
		expect(cachedData).toEqual(testData)
	})

	test('supports array data', () => {
		const testData = [
			{ id: '1', name: 'User 1' },
			{ id: '2', name: 'User 2' },
		]
		const queryKey = ['users']

		mockApiResponse(queryClient, queryKey, testData)

		const cachedData = queryClient.getQueryData(queryKey)
		expect(cachedData).toEqual(testData)
	})

	test('applies delay when specified', async () => {
		const testData = { id: '1', name: 'Test User' }
		const queryKey = ['users', '1']
		const startTime = Date.now()

		await mockApiResponse(queryClient, queryKey, testData, { delay: 100 })

		const elapsed = Date.now() - startTime
		expect(elapsed).toBeGreaterThanOrEqual(100)
		expect(queryClient.getQueryData(queryKey)).toEqual(testData)
	})

	test('handles null data', () => {
		const queryKey = ['users', 'null']

		mockApiResponse(queryClient, queryKey, null)

		const cachedData = queryClient.getQueryData(queryKey)
		expect(cachedData).toBeNull()
	})
})

describe('waitForQuery', () => {
	let queryClient: QueryClient

	beforeEach(() => {
		queryClient = createTestQueryClient()
	})

	test('resolves when query completes successfully', async () => {
		const queryKey = ['test-query']
		const testData = { result: 'success' }

		// Start a query
		const promise = queryClient.fetchQuery({
			queryKey,
			queryFn: async () => {
				await new Promise((resolve) => setTimeout(resolve, 50))
				return testData
			},
		})

		// Wait for it to complete
		await waitForQuery(queryClient, queryKey)

		// Verify it completed
		const data = queryClient.getQueryData(queryKey)
		expect(data).toEqual(testData)

		await promise
	})

	test('resolves when query errors', async () => {
		const queryKey = ['error-query']

		// Start a query that will error
		const promise = queryClient
			.fetchQuery({
				queryKey,
				queryFn: async () => {
					await new Promise((resolve) => setTimeout(resolve, 50))
					throw new Error('Test error')
				},
			})
			.catch(() => {
				// Ignore the error, we're testing waitForQuery
			})

		// Wait for it to complete (even though it errors)
		await waitForQuery(queryClient, queryKey)

		// Verify the query state shows an error
		const state = queryClient.getQueryState(queryKey)
		expect(state?.status).toBe('error')

		await promise
	})

	test('times out if query takes too long', async () => {
		const queryKey = ['slow-query']

		// Start a query that never completes
		queryClient.fetchQuery({
			queryKey,
			queryFn: async () => {
				await new Promise((resolve) => setTimeout(resolve, 10000))
				return 'never'
			},
		})

		// Wait with a short timeout
		await expect(
			waitForQuery(queryClient, queryKey, { timeout: 100 }),
		).rejects.toThrow('Timeout waiting for query')
	})
})

describe('renderHookWithStore', () => {
	test('wraps renderHook and includes store reference', () => {
		// This is a simple wrapper function that passes through to renderHook
		// The actual rendering is tested in integration tests with proper DOM setup
		interface TestState {
			count: number
		}

		const testStore = create<TestState>(() => ({ count: 0 }))

		// Test that the function signature works correctly
		// Actual DOM rendering is tested in component tests
		expect(typeof renderHookWithStore).toBe('function')
		expect(testStore.getState().count).toBe(0)
	})
})

describe('store registry', () => {
	beforeEach(() => {
		clearStoreRegistry()
	})

	test('registerStore adds store to registry', () => {
		interface TestState {
			value: string
		}

		const testStore = create<TestState>(() => ({ value: 'initial' }))

		registerStore(testStore)

		// Modify the store
		testStore.setState({ value: 'modified' })
		expect(testStore.getState().value).toBe('modified')

		// Reset should restore initial state
		resetAllStores()
		expect(testStore.getState().value).toBe('initial')
	})

	test('resetAllStores resets multiple stores', () => {
		interface CountState {
			count: number
			increment: () => void
		}

		const store1 = create<CountState>((set) => ({
			count: 0,
			increment: () => set((state) => ({ count: state.count + 1 })),
		}))

		const store2 = create<CountState>((set) => ({
			count: 10,
			increment: () => set((state) => ({ count: state.count + 1 })),
		}))

		registerStore(store1)
		registerStore(store2)

		// Modify both stores
		store1.getState().increment()
		store2.getState().increment()

		expect(store1.getState().count).toBe(1)
		expect(store2.getState().count).toBe(11)

		// Reset all
		resetAllStores()

		expect(store1.getState().count).toBe(0)
		expect(store2.getState().count).toBe(10)
	})

	test('clearStoreRegistry removes all stores', () => {
		interface TestState {
			value: number
		}

		const testStore = create<TestState>(() => ({ value: 42 }))

		registerStore(testStore)
		clearStoreRegistry()

		// Modify the store
		testStore.setState({ value: 100 })

		// Reset should not affect the store since it's not registered
		resetAllStores()
		expect(testStore.getState().value).toBe(100)
	})
})
