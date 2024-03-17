import { useMutation } from '@tanstack/react-query'
import wretch from 'wretch'

import { userApi } from '../list'
import generateToken from '../refresh'
import { SuccessResult } from '~/types'
import { UserPayload, Users } from '~/types/users'
import { token } from '~/constant'

function useAddUserMutation() {
	return useMutation({
		mutationFn: async (payload: UserPayload) => {
			try {
				const result: Promise<SuccessResult<Partial<Users>>> = wretch(
					userApi.allUsers,
				)
					.auth(`Bearer ${token}`)
					.post(payload)
					.badRequest((err) => {
						throw new Error(err.response.statusText)
					})
					.unauthorized(async () => {
						generateToken()
						// Retry the request after refreshing the token
						await wretch(userApi.allUsers)
							.auth(`Bearer ${token}`)
							.post(payload)
							.json()
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

export default useAddUserMutation
