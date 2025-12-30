/**
 * Component render utilities for testing
 * Provides helpers for rendering components with necessary providers
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'

/**
 * Create a QueryClient with test-friendly defaults
 * Disables retries and sets short cache times for faster tests
 */
export function createTestQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// Disable retries to make tests fail fast
				retry: false,
				// Disable refetch on window focus for predictable tests
				refetchOnWindowFocus: false,
				// Short cache time to avoid stale data between tests
				gcTime: 0,
				staleTime: 0,
			},
			mutations: {
				// Disable retries for mutations as well
				retry: false,
			},
		},
	})
}

/**
 * Options for renderWithProviders
 */
export interface RenderWithProvidersOptions extends Omit<
	RenderOptions,
	'wrapper'
> {
	/**
	 * Custom QueryClient instance for the test
	 * If not provided, a new test QueryClient will be created
	 */
	queryClient?: QueryClient

	/**
	 * Initial route for the router
	 * If not provided, defaults to '/'
	 */
	initialRoute?: string

	/**
	 * Additional routes to configure in the test router
	 * Useful for testing navigation and route-specific behavior
	 */
	routes?: Array<{
		path: string
		element: React.ReactElement
	}>
}

/**
 * Extended render result that includes the queryClient
 */
export interface RenderWithProvidersResult extends ReturnType<typeof render> {
	queryClient: QueryClient
}

/**
 * Render a component with all necessary providers for testing
 * Includes QueryClientProvider and MemoryRouter
 *
 * @example
 * ```tsx
 * const { queryClient } = renderWithProviders(<MyComponent />)
 *
 * // With custom query client
 * const customClient = createTestQueryClient()
 * renderWithProviders(<MyComponent />, { queryClient: customClient })
 *
 * // With initial route
 * renderWithProviders(<MyComponent />, { initialRoute: '/users/123' })
 * ```
 */
export function renderWithProviders(
	ui: React.ReactElement,
	options: RenderWithProvidersOptions = {},
): RenderWithProvidersResult {
	const {
		queryClient = createTestQueryClient(),
		initialRoute = '/',
		routes = [],
		...renderOptions
	} = options

	// Create a memory router with the component and any additional routes
	const router = createMemoryRouter(
		[
			{
				path: initialRoute,
				element: ui,
			},
			...routes,
		],
		{
			initialEntries: [initialRoute],
		},
	)

	// Wrapper component that provides all necessary context
	function Wrapper({ children }: { children: React.ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		)
	}

	// Always use RouterProvider to ensure router context is available
	const component = <RouterProvider router={router} />

	const renderResult = render(component, {
		wrapper: Wrapper,
		...renderOptions,
	})

	return {
		...renderResult,
		queryClient,
	}
}
