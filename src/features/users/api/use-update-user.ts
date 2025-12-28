import { useMutation, useQueryClient } from '@tanstack/react-query'
import { USE_MOCK_API } from '~/shared/config/env'
import { userApi } from '~/shared/api/endpoints'
import { apiClient } from '~/shared/api/client'
import { QUERY_CONFIG } from '~/shared/api/config'
import { mockUpdateUser } from '~/mock/handlers/users.handlers'
import type { UserUpdatePayload, UserResponse } from '../types/user.types'

export function useUpdateUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			id,
			payload,
		}: {
			id: string
			payload: UserUpdatePayload
		}): Promise<UserResponse> => {
			if (USE_MOCK_API) {
				return mockUpdateUser(id, payload)
			}

			try {
				const response = await apiClient
					.patch(userApi.singleUser(id), {
						json: payload,
					})
					.json<UserResponse>()
				return response
			} catch (error) {
				console.error('Update user failed:', error)
				throw error
			}
		},
		retry: QUERY_CONFIG.RETRY,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
		},
	})
}
