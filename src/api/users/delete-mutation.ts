import { useMutation } from '@tanstack/react-query'
import wretch from 'wretch'

import { userApi } from '../list'
import { SuccessResult } from '~/types'
import { Users } from '~/types/users'
import { token } from '~/constant'
import { generateToken } from '../refresh'

export function useDeleteUserMutation() {
	return useMutation({
		mutationFn: async (uuid: string) => {
			try {
				const result: Promise<SuccessResult<Partial<Users>>> = wretch(
					userApi.singleUser(uuid),
				)
					.auth(`Bearer ${token}`)
					.delete()
					.badRequest((err) => {
						throw new Error(err.response.statusText)
					})
					.unauthorized(async () => {
						generateToken()

						await wretch(userApi.singleUser(uuid))
							.auth(`Bearer ${token}`)
							.delete()
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
