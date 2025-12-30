/**
 * Tests for component render utilities
 */

import { describe, test, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { createTestQueryClient, renderWithProviders } from './render-utils'

describe('createTestQueryClient', () => {
	test('creates a QueryClient with test-friendly defaults', () => {
		const queryClient = createTestQueryClient()

		expect(queryClient).toBeDefined()
		expect(queryClient.getDefaultOptions().queries?.retry).toBe(false)
		expect(queryClient.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(
			false,
		)
		expect(queryClient.getDefaultOptions().mutations?.retry).toBe(false)
	})

	test('creates independent QueryClient instances', () => {
		const client1 = createTestQueryClient()
		const client2 = createTestQueryClient()

		expect(client1).not.toBe(client2)
	})
})

describe('renderWithProviders', () => {
	test('renders component with QueryClientProvider', () => {
		function TestComponent() {
			return <div>Test Component</div>
		}

		renderWithProviders(<TestComponent />)

		expect(screen.getByText('Test Component')).toBeInTheDocument()
	})

	test('returns queryClient in result', () => {
		function TestComponent() {
			return <div>Test</div>
		}

		const { queryClient } = renderWithProviders(<TestComponent />)

		expect(queryClient).toBeDefined()
		expect(queryClient.getDefaultOptions().queries?.retry).toBe(false)
	})

	test('accepts custom QueryClient', () => {
		const customClient = createTestQueryClient()

		function TestComponent() {
			return <div>Test</div>
		}

		const { queryClient } = renderWithProviders(<TestComponent />, {
			queryClient: customClient,
		})

		expect(queryClient).toBe(customClient)
	})

	test('supports React Query hooks in rendered components', async () => {
		function TestComponent() {
			const { data, isLoading } = useQuery({
				queryKey: ['test'],
				queryFn: async () => {
					return { message: 'Hello from query' }
				},
			})

			if (isLoading) return <div>Loading...</div>
			return <div>{data?.message}</div>
		}

		renderWithProviders(<TestComponent />)

		expect(screen.getByText('Loading...')).toBeInTheDocument()

		await waitFor(() => {
			expect(screen.getByText('Hello from query')).toBeInTheDocument()
		})
	})

	test('provides access to queryClient for assertions', async () => {
		function TestComponent() {
			const { data } = useQuery({
				queryKey: ['user', '123'],
				queryFn: async () => ({ id: '123', name: 'Test User' }),
			})

			return <div>{data?.name || 'Loading'}</div>
		}

		const { queryClient } = renderWithProviders(<TestComponent />)

		await waitFor(() => {
			expect(screen.getByText('Test User')).toBeInTheDocument()
		})

		// Can inspect query state through queryClient
		const queryData = queryClient.getQueryData(['user', '123'])
		expect(queryData).toEqual({ id: '123', name: 'Test User' })
	})
})
