import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '~/shared/api/endpoints'
import { apiClient } from '~/shared/api/client'
import { QUERY_CONFIG } from '~/shared/api/config'
import type { UserResponse } from '../types/user.types'

export function useDeleteUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (userId: string): Promise<UserResponse> => {
			try {
				const response = await apiClient
					.delete(userApi.singleUser(userId))
					.json<UserResponse>()
				return response
			} catch (error) {
				console.error('Delete user failed:', error)
				throw error
			}
		},
		retry: QUERY_CONFIG.RETRY,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
		},
	})
}
