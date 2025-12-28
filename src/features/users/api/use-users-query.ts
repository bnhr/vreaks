import { useQuery } from '@tanstack/react-query'
import { USE_MOCK_API } from '~/shared/config/env'
import { userApi } from '~/shared/api/endpoints'
import { apiClient } from '~/shared/api/client'
import { QUERY_CONFIG } from '~/shared/api/config'
import { mockGetUsers } from '~/mock/handlers/users.handlers'
import type { UserListResponse } from '../types/user.types'

export function useUsersQuery() {
	return useQuery({
		queryKey: ['users'],
		queryFn: async (): Promise<UserListResponse> => {
			if (USE_MOCK_API) {
				return mockGetUsers()
			}

			try {
				const response = await apiClient
					.get(userApi.allUsers)
					.json<UserListResponse>()
				return response
			} catch (error) {
				console.error('Get users failed:', error)
				throw error
			}
		},
		staleTime: QUERY_CONFIG.STALE_TIME,
		retry: QUERY_CONFIG.RETRY,
	})
}
