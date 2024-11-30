import { useMutation } from '@tanstack/react-query'

import { SuccessResult } from '~/types'
import { UserPayload, Users } from '~/types/users'
import { kyAPI } from '~/api/fetchers/ky'
import { userApi } from '~/api/list'

export function useAddUserMutation() {
	return useMutation({
		mutationFn: async (payload: UserPayload) => {
			try {
				const result = await kyAPI
					.post(userApi.allUsers, {
						json: payload,
					})
					.json<SuccessResult<Partial<Users>>>()
				return result
			} catch (error) {
				console.log('🚀 ~ mutationFn: ~ error:', error)
				throw error
			}
		},
	})
}
