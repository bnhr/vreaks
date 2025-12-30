/**
 * Example: Query Definitions for Data Mode + TanStack Query Hybrid
 * 
 * This file demonstrates how to define queries using queryOptions()
 * that work with both React Router loaders and useQuery hooks.
 * 
 * Key Benefits:
 * - Single source of truth for query configuration
 * - Works with loaders (pre-fetch) and useQuery (caching + refetch)
 * - Mock API logic stays in one place
 * - Type-safe query keys and data
 * 
 * Usage:
 * 1. Copy this file to: features/[feature-name]/api/[feature]-queries.ts
 * 2. Update types and API endpoints
 * 3. Use in loaders and components
 */

import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '~/shared/api/client'
import { USE_MOCK_API } from '~/shared/config/env'
import { mockUsers } from '~/mock/data/users'
import type { User, UserListResponse } from '../types/user.types'

/**
 * Query for fetching all users
 * 
 * Used by:
 * - usersLoader (pre-fetch before route renders)
 * - useQuery in component (caching + background refetch)
 */
export const usersQuery = () =>
	queryOptions({
		queryKey: ['users'],
		queryFn: async (): Promise<UserListResponse> => {
			if (USE_MOCK_API) {
				return { data: mockUsers, total: mockUsers.length }
			}
			return apiClient.get('users').json<UserListResponse>()
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})

/**
 * Query for fetching a single user by ID
 * 
 * Used by:
 * - userLoader (pre-fetch before route renders)
 * - useQuery in component (caching + background refetch)
 */
export const userQuery = (userId: string) =>
	queryOptions({
		queryKey: ['users', userId],
		queryFn: async (): Promise<User> => {
			if (USE_MOCK_API) {
				const user = mockUsers.find((u) => u.id === userId)
				if (!user) throw new Error('User not found')
				return user
			}
			return apiClient.get(`users/${userId}`).json<User>()
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})

/**
 * Why queryOptions()?
 * 
 * queryOptions() creates a reusable query definition that:
 * - Can be used with queryClient.ensureQueryData() in loaders
 * - Can be spread into useQuery() in components
 * - Ensures consistent configuration across loaders and components
 * - Provides type safety for query keys and return types
 * 
 * Example:
 * 
 * // In loader
 * const data = await queryClient.ensureQueryData(userQuery(userId))
 * 
 * // In component
 * const { data } = useQuery(userQuery(userId))
 */
