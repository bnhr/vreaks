import { useMutation } from '@tanstack/react-query'

import { SuccessResult } from '~/types'
import { Users } from '~/types/users'
import { kyAPI } from '~/api/fetchers/ky'
import { userApi } from '~/api/fetchers/list'

export function useDeleteUserMutation() {
	return useMutation({
		mutationFn: async (uuid: string) => {
			try {
				const result = await kyAPI
					.delete(userApi.singleUser(uuid))
					.json<SuccessResult<Partial<Users>>>()

				return result
			} catch (error) {
				console.log('🚀 ~ mutationFn: ~ error:', error)
				throw error
			}
		},
	})
}
