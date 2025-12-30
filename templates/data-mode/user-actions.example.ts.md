/**
 * Example: React Router Actions with TanStack Query Invalidation
 * 
 * This file demonstrates how to create actions that:
 * - Handle form submissions and mutations
 * - Invalidate TanStack Query cache automatically
 * - Redirect after successful mutation
 * - Work with the mock API pattern
 * 
 * Key Benefits:
 * - Declarative form handling with <Form> component
 * - Automatic cache invalidation (no manual refetch)
 * - Control over when to show fresh vs stale data
 * - Type-safe with TypeScript
 * 
 * Usage:
 * 1. Copy this file to: features/[feature-name]/api/[feature]-actions.ts
 * 2. Update API endpoints and types
 * 3. Add to router configuration
 */

import type { QueryClient } from '@tanstack/react-query'
import type { ActionFunctionArgs } from 'react-router'
import { redirect } from 'react-router'
import { apiClient } from '~/shared/api/client'
import { USE_MOCK_API } from '~/shared/config/env'
import type { UserPayload } from '../types/user.types'

/**
 * Action for creating a new user
 * 
 * Handles form submission, creates user, invalidates cache, and redirects.
 * 
 * Router config:
 * {
 *   path: 'users/new',
 *   loader: newUserLoader(queryClient),
 *   action: createUserAction(queryClient),
 *   Component: NewUserPage
 * }
 * 
 * Component usage:
 * <Form method="post">
 *   <input name="username" />
 *   <input name="email" />
 *   <button type="submit">Create User</button>
 * </Form>
 */
export const createUserAction =
	(queryClient: QueryClient) =>
	async ({ request }: ActionFunctionArgs) => {
		const formData = await request.formData()

		// Extract form data
		const payload: UserPayload = {
			username: formData.get('username') as string,
			email: formData.get('email') as string,
			first_name: formData.get('first_name') as string,
			last_name: formData.get('last_name') as string,
			role: (formData.get('role') as string) || 'user',
			password: formData.get('password') as string,
		}

		// Create user
		if (USE_MOCK_API) {
			// Mock implementation
			console.log('Mock: Creating user', payload)
		} else {
			await apiClient.post('users', { json: payload })
		}

		// Invalidate users list cache
		// WITH await: Wait for refetch, then redirect (fresh data guaranteed)
		await queryClient.invalidateQueries({ queryKey: ['users'] })

		// WITHOUT await: Redirect immediately, refetch in background (faster UX)
		// queryClient.invalidateQueries({ queryKey: ['users'] })

		// Redirect to users list
		return redirect('/admin/users')
	}

/**
 * Action for updating an existing user
 * 
 * Handles form submission, updates user, invalidates cache, and redirects.
 * 
 * Router config:
 * {
 *   path: 'users/:userId/edit',
 *   loader: editUserLoader(queryClient),
 *   action: updateUserAction(queryClient),
 *   Component: EditUserPage
 * }
 */
export const updateUserAction =
	(queryClient: QueryClient) =>
	async ({ request, params }: ActionFunctionArgs) => {
		const { userId } = params

		if (!userId) {
			throw new Error('User ID is required')
		}

		const formData = await request.formData()

		// Extract form data
		const updates = {
			username: formData.get('username') as string,
			email: formData.get('email') as string,
			first_name: formData.get('first_name') as string,
			last_name: formData.get('last_name') as string,
			role: formData.get('role') as string,
		}

		// Update user
		if (USE_MOCK_API) {
			console.log('Mock: Updating user', userId, updates)
		} else {
			await apiClient.put(`users/${userId}`, { json: updates })
		}

		// Invalidate both users list and specific user cache
		await queryClient.invalidateQueries({ queryKey: ['users'] })

		// Redirect to user detail page
		return redirect(`/admin/users/${userId}`)
	}

/**
 * Action for deleting a user
 * 
 * Handles deletion, invalidates cache, and redirects.
 * 
 * Router config:
 * {
 *   path: 'users/:userId',
 *   loader: userLoader(queryClient),
 *   action: deleteUserAction(queryClient),
 *   Component: UserDetailPage
 * }
 * 
 * Component usage:
 * <Form method="delete">
 *   <button type="submit">Delete User</button>
 * </Form>
 */
export const deleteUserAction =
	(queryClient: QueryClient) =>
	async ({ params }: ActionFunctionArgs) => {
		const { userId } = params

		if (!userId) {
			throw new Error('User ID is required')
		}

		// Delete user
		if (USE_MOCK_API) {
			console.log('Mock: Deleting user', userId)
		} else {
			await apiClient.delete(`users/${userId}`)
		}

		// Invalidate cache
		await queryClient.invalidateQueries({ queryKey: ['users'] })

		// Redirect to users list
		return redirect('/admin/users')
	}

/**
 * The await lever:
 * 
 * await queryClient.invalidateQueries(...)
 * ☝️ WITH await: Wait for refetch, then redirect
 *    - Pros: Fresh data guaranteed on next page
 *    - Cons: Slower redirect (waits for network)
 * 
 * queryClient.invalidateQueries(...)
 * ☝️ WITHOUT await: Redirect immediately, refetch in background
 *    - Pros: Faster redirect (better UX)
 *    - Cons: May show stale data briefly
 * 
 * Choose based on your needs:
 * - Critical data: Use await
 * - Nice-to-have freshness: Skip await
 */

/**
 * Error Handling:
 * 
 * Actions can return error responses:
 * 
 * try {
 *   await apiClient.post('users', { json: payload })
 * } catch (error) {
 *   return {
 *     error: 'Failed to create user',
 *     message: error.message
 *   }
 * }
 * 
 * Access in component with useActionData():
 * 
 * const actionData = useActionData()
 * if (actionData?.error) {
 *   return <ErrorMessage>{actionData.message}</ErrorMessage>
 * }
 */

/**
 * Optimistic Updates:
 * 
 * For instant UI feedback, update cache before API call:
 * 
 * // Optimistically update cache
 * queryClient.setQueryData(['users'], (old) => [...old, newUser])
 * 
 * try {
 *   await apiClient.post('users', { json: payload })
 * } catch (error) {
 *   // Rollback on error
 *   queryClient.invalidateQueries({ queryKey: ['users'] })
 *   throw error
 * }
 */
