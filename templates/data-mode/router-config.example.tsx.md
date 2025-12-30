/**
 * Example: Router Configuration with Data Mode
 * 
 * This file demonstrates how to configure React Router with:
 * - Loaders for data pre-fetching
 * - Actions for form handling
 * - Error boundaries
 * - QueryClient integration
 * 
 * Key Benefits:
 * - Declarative data loading
 * - Parallel route data fetching
 * - Centralized error handling
 * - Type-safe routing
 * 
 * Usage:
 * 1. Copy relevant parts to: src/app/routes/index.tsx
 * 2. Update imports
 * 3. Add loaders/actions to routes as needed
 */

import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClient } from '~/shared/lib/react-query'
import { MainLayout } from '~/shared/components/layouts/main-layout'
import { AdminLayout } from '~/shared/components/layouts/admin-layout'
import { ProtectedRoute } from '~/features/auth'
import { LazyComponent } from '~/shared/components/layouts/lazy-comp'

// Import loaders and actions
import {
	usersLoader,
	userLoader,
} from '~/features/users/api/user-loader'
import {
	createUserAction,
	updateUserAction,
	deleteUserAction,
} from '~/features/users/api/user-actions'

// Import pages
import HomePage from '~/pages/home'
import LoginPage from '~/pages/login'

const NotFoundPage = lazy(() => import('~/pages/not-found'))
const AdminDashboard = lazy(() => import('~/pages/admin/dashboard'))
const UsersListPage = lazy(() => import('~/pages/admin/users'))
const UserDetailPage = lazy(() => import('~/pages/admin/users/[id]'))
const NewUserPage = lazy(() => import('~/pages/admin/users/new'))
const EditUserPage = lazy(() => import('~/pages/admin/users/[id]/edit'))

/**
 * Router with Data Mode
 * 
 * Key differences from Declarative Mode:
 * - Routes have loader and action properties
 * - QueryClient is passed to loaders/actions
 * - Error boundaries with errorElement
 */
const router = createBrowserRouter([
	{
		path: '/',
		Component: MainLayout,
		children: [
			{
				index: true,
				Component: HomePage,
			},
			{
				path: 'login',
				Component: LoginPage,
			},
			{
				path: '*',
				Component: NotFoundPage,
			},
		],
	},
	{
		path: '/admin',
		Component: () => (
			<ProtectedRoute>
				<AdminLayout />
			</ProtectedRoute>
		),
		children: [
			{
				index: true,
				Component: () => (
					<LazyComponent>
						<AdminDashboard />
					</LazyComponent>
				),
			},
			{
				path: 'users',
				children: [
					{
						// List all users
						index: true,
						loader: usersLoader(queryClient),
						Component: () => (
							<LazyComponent>
								<UsersListPage />
							</LazyComponent>
						),
					},
					{
						// Create new user
						path: 'new',
						action: createUserAction(queryClient),
						Component: () => (
							<LazyComponent>
								<NewUserPage />
							</LazyComponent>
						),
					},
					{
						// View user details
						path: ':userId',
						loader: userLoader(queryClient),
						action: deleteUserAction(queryClient),
						Component: () => (
							<LazyComponent>
								<UserDetailPage />
							</LazyComponent>
						),
					},
					{
						// Edit user
						path: ':userId/edit',
						loader: userLoader(queryClient),
						action: updateUserAction(queryClient),
						Component: () => (
							<LazyComponent>
								<EditUserPage />
							</LazyComponent>
						),
					},
				],
			},
		],
	},
])

/**
 * Root component with QueryClient provider
 */
function Root() {
	return (
		<QueryClientProvider client={queryClient}>
			{import.meta.env.VITE_MODE !== 'production' && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
			<RouterProvider router={router} />
		</QueryClientProvider>
	)
}

export default Root

/**
 * Mixing Declarative and Data Mode:
 * 
 * You can mix both approaches in the same router:
 * - Use Data Mode for routes that benefit from loaders/actions
 * - Keep Declarative Mode for simple routes
 * 
 * Example:
 * {
 *   path: 'simple',
 *   Component: SimplePage  // No loader, uses useQuery in component
 * },
 * {
 *   path: 'complex/:id',
 *   loader: complexLoader(queryClient),  // Pre-fetch with loader
 *   Component: ComplexPage
 * }
 */

/**
 * Error Boundaries:
 * 
 * Add errorElement to handle loader/action errors:
 * 
 * {
 *   path: 'users/:userId',
 *   loader: userLoader(queryClient),
 *   Component: UserDetailPage,
 *   errorElement: <ErrorPage />
 * }
 * 
 * Or create a reusable error component:
 * 
 * function ErrorPage() {
 *   const error = useRouteError()
 *   return (
 *     <div>
 *       <h1>Oops!</h1>
 *       <p>{error.message}</p>
 *     </div>
 *   )
 * }
 */

/**
 * Middleware (Optional):
 * 
 * React Router 7 supports middleware for auth, logging, etc:
 * 
 * import { authMiddleware } from '~/features/auth/middleware'
 * 
 * {
 *   path: '/admin',
 *   middleware: [authMiddleware],
 *   Component: AdminLayout,
 *   children: [...]
 * }
 * 
 * Middleware example:
 * 
 * export async function authMiddleware({ request }, next) {
 *   const token = getToken()
 *   if (!token) {
 *     throw redirect('/login')
 *   }
 *   await next()
 * }
 */

/**
 * Parallel Data Loading:
 * 
 * When navigating to a route with nested loaders, all loaders run in parallel:
 * 
 * /admin/users/123
 * ├─ adminLoader()      ← Runs in parallel
 * └─ userLoader(123)    ← Runs in parallel
 * 
 * This prevents waterfall loading and improves performance.
 */

/**
 * When to use loaders vs useQuery:
 * 
 * Use loaders when:
 * - Data is required before rendering (no loading state acceptable)
 * - Data depends on route params
 * - You want parallel loading for nested routes
 * 
 * Use useQuery only when:
 * - Data is fetched on user interaction (search, filters)
 * - Real-time data with polling
 * - Data shared across routes without navigation
 * - You need background refetching features
 * 
 * Use both (hybrid) when:
 * - You want instant first render + background refetch
 * - You want caching + pre-fetching
 * - You want the best of both worlds (recommended!)
 */
