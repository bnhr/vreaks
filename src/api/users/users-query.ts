import { useQuery } from '@tanstack/react-query'
import { kyAPI } from '~/api/fetchers/ky'
import { userApi } from '~/api/fetchers/list'

import { SuccessResult } from '~/types'
import { Users } from '~/types/users'

export function useUsersQuery() {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			try {
				const result = await kyAPI
					.get(userApi.allUsers)
					.json<SuccessResult<Users[]>>()

				return result
			} catch (error) {
				console.log('🚀 ~ mutationFn: ~ error:', error)
				throw error
			}
		},
	})
}
