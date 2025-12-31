import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '~/shared/api/endpoints'
import { apiClient } from '~/shared/api/client'
import { QUERY_CONFIG } from '~/shared/api/config'
import type { UserPayload, UserResponse } from '../types/user.types'

export function useCreateUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: UserPayload): Promise<UserResponse> => {
			try {
				const response = await apiClient
					.post(userApi.allUsers, {
						json: payload,
					})
					.json<UserResponse>()
				return response
			} catch (error) {
				console.error('Create user failed:', error)
				throw error
			}
		},
		retry: QUERY_CONFIG.RETRY,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
		},
	})
}
