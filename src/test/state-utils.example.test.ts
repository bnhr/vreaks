/**
 * Example tests demonstrating state management utilities
 * These examples show how to use mockApiResponse, waitForQuery, and Zustand utilities
 * @vitest-environment jsdom
 */

import { describe, test, expect, beforeEach } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import {
	createTestQueryClient,
	mockApiResponse,
	waitForQuery,
	registerStore,
	resetAllStores,
} from './index'

describe('React Query Testing Examples', () => {
	let queryClient: QueryClient

	beforeEach(() => {
		queryClient = createTestQueryClient()
	})

	test('example: mocking a user query', async () => {
		// Mock user data
		const mockUser = {
			id: '123',
			name: 'John Doe',
			email: 'john@example.com',
		}

		// Set the mock data in the cache
		await mockApiResponse(queryClient, ['users', '123'], mockUser)

		// Retrieve the data
		const cachedUser = queryClient.getQueryData(['users', '123'])

		expect(cachedUser).toEqual(mockUser)
	})

	test('example: mocking a list of items', async () => {
		// Mock a list of users
		const mockUsers = [
			{ id: '1', name: 'Alice' },
			{ id: '2', name: 'Bob' },
			{ id: '3', name: 'Charlie' },
		]

		await mockApiResponse(queryClient, ['users'], mockUsers)

		const cachedUsers = queryClient.getQueryData(['users'])
		expect(cachedUsers).toHaveLength(3)
	})

	test('example: simulating API delay', async () => {
		const mockData = { result: 'success' }

		// Mock with a 100ms delay
		const startTime = Date.now()
		await mockApiResponse(queryClient, ['delayed'], mockData, { delay: 100 })
		const elapsed = Date.now() - startTime

		expect(elapsed).toBeGreaterThanOrEqual(100)
		expect(queryClient.getQueryData(['delayed'])).toEqual(mockData)
	})

	test('example: waiting for async query to complete', async () => {
		const mockData = { id: '1', status: 'complete' }

		// Start a query that will complete after a delay
		queryClient.fetchQuery({
			queryKey: ['async-query'],
			queryFn: async () => {
				await new Promise((resolve) => setTimeout(resolve, 50))
				return mockData
			},
		})

		// Wait for the query to complete
		await waitForQuery(queryClient, ['async-query'])

		// Now we can assert on the result
		const result = queryClient.getQueryData(['async-query'])
		expect(result).toEqual(mockData)
	})
})

describe('Zustand Testing Examples', () => {
	// Example store
	interface CounterState {
		count: number
		increment: () => void
		decrement: () => void
		reset: () => void
	}

	const useCounterStore = create<CounterState>((set) => ({
		count: 0,
		increment: () => set((state) => ({ count: state.count + 1 })),
		decrement: () => set((state) => ({ count: state.count - 1 })),
		reset: () => set({ count: 0 }),
	}))

	beforeEach(() => {
		// Register the store for automatic cleanup
		registerStore(useCounterStore)
		// Reset all stores before each test
		resetAllStores()
	})

	test('example: testing store actions', () => {
		const store = useCounterStore.getState()

		expect(store.count).toBe(0)

		store.increment()
		expect(useCounterStore.getState().count).toBe(1)

		store.increment()
		expect(useCounterStore.getState().count).toBe(2)

		store.decrement()
		expect(useCounterStore.getState().count).toBe(1)
	})

	test('example: store isolation between tests', () => {
		// This test starts with a fresh store (count = 0)
		// even though the previous test modified it
		const store = useCounterStore.getState()
		expect(store.count).toBe(0)
	})

	test('example: testing store reset', () => {
		const store = useCounterStore.getState()

		// Modify the store
		store.increment()
		store.increment()
		store.increment()
		expect(useCounterStore.getState().count).toBe(3)

		// Reset the store
		store.reset()
		expect(useCounterStore.getState().count).toBe(0)
	})
})

describe('Combined React Query and Zustand Example', () => {
	let queryClient: QueryClient

	interface UserState {
		selectedUserId: string | null
		setSelectedUser: (id: string | null) => void
	}

	const useUserStore = create<UserState>((set) => ({
		selectedUserId: null,
		setSelectedUser: (id) => set({ selectedUserId: id }),
	}))

	beforeEach(() => {
		queryClient = createTestQueryClient()
		registerStore(useUserStore)
		resetAllStores()
	})

	test('example: coordinating React Query and Zustand', async () => {
		// Mock user data in React Query
		const mockUser = {
			id: '123',
			name: 'Jane Doe',
			email: 'jane@example.com',
		}

		await mockApiResponse(queryClient, ['users', '123'], mockUser)

		// Select the user in Zustand
		useUserStore.getState().setSelectedUser('123')

		// Verify both states
		expect(useUserStore.getState().selectedUserId).toBe('123')
		expect(queryClient.getQueryData(['users', '123'])).toEqual(mockUser)
	})
})
