/**
 * Example: Component Using Data Mode + TanStack Query Hybrid
 * 
 * This file demonstrates how to use loader data with useQuery for:
 * - Instant initial render (no loading spinner)
 * - Background refetching (keep data fresh)
 * - Type-safe data access
 * 
 * Key Benefits:
 * - First visit: Data pre-loaded by loader (no spinner)
 * - Repeat visits: Instant cached data + background refresh
 * - Stale data: Automatically refetched in background
 * - Type safety: initialData narrows type to non-undefined
 * 
 * Usage:
 * 1. Copy this file to: pages/[feature-name]/[page-name].tsx
 * 2. Update imports and types
 * 3. Add to router with loader
 */

import { useLoaderData, useParams, Form } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { userQuery } from '~/features/users/api/user-queries'
import type { User } from '~/features/users/types/user.types'

/**
 * User Detail Page with Data Mode
 * 
 * Router config:
 * {
 *   path: 'users/:userId',
 *   loader: userLoader(queryClient),
 *   action: deleteUserAction(queryClient),
 *   Component: UserDetailPage
 * }
 */
export default function UserDetailPage() {
	// Get pre-loaded data from loader
	const initialData = useLoaderData() as User
	const { userId } = useParams()

	// Use query with initialData for caching + background refetch
	const { data: user, isRefetching } = useQuery({
		...userQuery(userId!),
		initialData, // Type is now User, not User | undefined
	})

	return (
		<div className="p-4">
			<div className="mb-4 flex items-center justify-between">
				<h1 className="text-2xl font-bold">User Details</h1>
				{isRefetching && (
					<span className="text-sm text-gray-500">Refreshing...</span>
				)}
			</div>

			<div className="space-y-4">
				<div>
					<label className="font-semibold">Username:</label>
					<p>{user.username}</p>
				</div>

				<div>
					<label className="font-semibold">Email:</label>
					<p>{user.email}</p>
				</div>

				<div>
					<label className="font-semibold">Name:</label>
					<p>
						{user.first_name} {user.last_name}
					</p>
				</div>

				<div>
					<label className="font-semibold">Role:</label>
					<p>{user.role}</p>
				</div>
			</div>

			<div className="mt-6 flex gap-4">
				{/* Edit button - navigates to edit page */}
				<a
					href={`/admin/users/${userId}/edit`}
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
					Edit User
				</a>

				{/* Delete button - uses Form for action */}
				<Form method="delete">
					<button
						type="submit"
						className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
						onClick={(e) => {
							if (!confirm('Are you sure you want to delete this user?')) {
								e.preventDefault()
							}
						}}
					>
						Delete User
					</button>
				</Form>
			</div>
		</div>
	)
}

/**
 * How it works:
 * 
 * 1. User navigates to /users/123
 * 2. userLoader pre-fetches data before component renders
 * 3. Component renders immediately with initialData (no loading state!)
 * 4. useQuery checks if data is stale:
 *    - If fresh: Uses cached data, no refetch
 *    - If stale: Uses cached data, refetches in background
 * 5. When refetch completes, component re-renders with fresh data
 * 
 * Result:
 * - No loading spinner on first visit
 * - Instant render on repeat visits
 * - Always shows data (never undefined)
 * - Background updates keep data fresh
 */

/**
 * Why initialData?
 * 
 * Without initialData:
 * const { data } = useQuery(userQuery(userId!))
 * // data type: User | undefined
 * // Need to handle undefined case
 * 
 * With initialData:
 * const { data } = useQuery({ ...userQuery(userId!), initialData })
 * // data type: User (never undefined!)
 * // No need for loading states or undefined checks
 */

/**
 * Form Component:
 * 
 * <Form> is React Router's enhanced form component:
 * - method="post" → Calls action on submit
 * - method="delete" → Calls action with DELETE method
 * - method="put" → Calls action with PUT method
 * - Automatically prevents default form submission
 * - Provides loading states via useNavigation()
 * 
 * Regular <form> vs <Form>:
 * - <form> → Browser submits, page reloads
 * - <Form> → React Router handles, no reload, calls action
 */

/**
 * Alternative: Edit Form Page
 * 
 * export default function EditUserPage() {
 *   const initialData = useLoaderData() as User
 *   const { userId } = useParams()
 *   const navigation = useNavigation()
 * 
 *   const { data: user } = useQuery({
 *     ...userQuery(userId!),
 *     initialData,
 *   })
 * 
 *   const isSubmitting = navigation.state === 'submitting'
 * 
 *   return (
 *     <Form method="put">
 *       <input name="username" defaultValue={user.username} />
 *       <input name="email" defaultValue={user.email} />
 *       <button type="submit" disabled={isSubmitting}>
 *         {isSubmitting ? 'Saving...' : 'Save Changes'}
 *       </button>
 *     </Form>
 *   )
 * }
 */

/**
 * Loading States:
 * 
 * useNavigation() provides global navigation state:
 * 
 * const navigation = useNavigation()
 * 
 * navigation.state:
 * - 'idle' → No navigation happening
 * - 'loading' → Loading next route (loader running)
 * - 'submitting' → Form submitting (action running)
 * 
 * Use for global loading indicators:
 * {navigation.state === 'loading' && <LoadingBar />}
 */
