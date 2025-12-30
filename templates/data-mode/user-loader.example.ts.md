/**
 * Example: React Router Loader with TanStack Query
 * 
 * This file demonstrates how to create loaders that:
 * - Pre-fetch data before the route renders (no loading spinner on first visit)
 * - Use TanStack Query cache (instant on repeat visits)
 * - Work with the mock API pattern
 * 
 * Key Benefits:
 * - Data loads in parallel with route matching (faster than useEffect)
 * - Cached data is returned instantly (no network request)
 * - Fresh data is fetched in background if stale
 * - Type-safe with TypeScript
 * 
 * Usage:
 * 1. Copy this file to: features/[feature-name]/api/[feature]-loader.ts
 * 2. Update query imports
 * 3. Add to router configuration
 */

import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router'
import { userQuery, usersQuery } from './user-queries'

/**
 * Loader for users list page
 * 
 * Pre-fetches all users before rendering the page.
 * Returns cached data if available, otherwise fetches fresh data.
 * 
 * Router config:
 * {
 *   path: 'users',
 *   loader: usersLoader(queryClient),
 *   Component: UsersPage
 * }
 */
export const usersLoader = (queryClient: QueryClient) => async () => {
	// Option 1: ensureQueryData (TanStack Query v5+)
	// Returns cached data if available, otherwise fetches
	return queryClient.ensureQueryData(usersQuery())

	// Option 2: Manual fallback (equivalent to ensureQueryData)
	// return (
	//   queryClient.getQueryData(usersQuery().queryKey) ??
	//   await queryClient.fetchQuery(usersQuery())
	// )
}

/**
 * Loader for single user page
 * 
 * Pre-fetches user details before rendering the page.
 * Uses route params to determine which user to fetch.
 * 
 * Router config:
 * {
 *   path: 'users/:userId',
 *   loader: userLoader(queryClient),
 *   Component: UserDetailPage
 * }
 */
export const userLoader =
	(queryClient: QueryClient) =>
	async ({ params }: LoaderFunctionArgs) => {
		const { userId } = params

		if (!userId) {
			throw new Error('User ID is required')
		}

		// Pre-fetch user data
		return queryClient.ensureQueryData(userQuery(userId))
	}

/**
 * How it works:
 * 
 * 1. User navigates to /users/123
 * 2. Router calls userLoader before rendering component
 * 3. Loader checks TanStack Query cache:
 *    - If cached: Returns immediately (instant!)
 *    - If not cached: Fetches from API, caches, then returns
 * 4. Component renders with data already available
 * 5. useQuery in component gets cached data + background refetch if stale
 * 
 * Result:
 * - First visit: No loading spinner (data loads before render)
 * - Repeat visits: Instant (cached data) + background refresh
 * - Navigation: Data loads early (router knows destination first)
 */

/**
 * Error Handling:
 * 
 * Loaders can throw errors that are caught by errorElement:
 * 
 * {
 *   path: 'users/:userId',
 *   loader: userLoader(queryClient),
 *   Component: UserDetailPage,
 *   errorElement: <ErrorPage />
 * }
 * 
 * Or use redirect for auth:
 * 
 * import { redirect } from 'react-router'
 * 
 * if (!isAuthenticated) {
 *   throw redirect('/login')
 * }
 */
