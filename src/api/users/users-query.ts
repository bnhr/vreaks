import { useQuery } from '@tanstack/react-query'
import wretch from 'wretch'

import { userApi } from '../list'
import { SuccessResult } from '~/types'
import generateToken from '../refresh'
import { token } from '~/constant'
import { Users } from '~/types/users'

function useUsersQuery() {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			try {
				const result: Promise<SuccessResult<Users[]>> = wretch(userApi.allUsers)
					.auth(`Bearer ${token}`)
					.get()
					.unauthorized(async () => {
						generateToken()

						await wretch(userApi.allUsers).auth(`Bearer ${token}`).get().json()
					})
					.internalError((err) => {
						throw new Error(err.response.statusText)
					})
					.json()

				return result
			} catch (error) {
				console.log('🚀 ~ mutationFn: ~ error:', error)
				throw error
			}
		},
	})
}

export default useUsersQuery
