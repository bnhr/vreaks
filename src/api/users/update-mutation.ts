import { useMutation } from '@tanstack/react-query'
import { kyAPI } from '~/api/fetchers/ky'
import { userApi } from '~/api/list'
import { SuccessResult } from '~/types'

import { UserEdit, Users } from '~/types/users'

export function useUpdateUserMutation() {
	return useMutation({
		mutationFn: async (data: UserEdit) => {
			const { id, payload } = data
			try {
				const result = kyAPI
					.patch(userApi.singleUser(id), {
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
