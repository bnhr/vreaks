import { useMutation } from '@tanstack/react-query'
import wretch from 'wretch'

import { userApi } from '../list'
import generateToken from '../refresh'
import { SuccessResult } from '~/types'
import { UserEdit, Users } from '~/types/users'
import { token } from '~/constant'

function useUpdateUserMutation() {
	return useMutation({
		mutationFn: async (data: UserEdit) => {
			try {
				const result: Promise<SuccessResult<Partial<Users>>> = wretch(
					userApi.singleUser(data.id),
				)
					.auth(`Bearer ${token}`)
					.patch(data.payload)
					.badRequest((err) => {
						throw new Error(err.response.statusText)
					})
					.unauthorized(async () => {
						generateToken()

						await wretch(userApi.singleUser(data.id))
							.auth(`Bearer ${token}`)
							.patch(data.payload)
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

export default useUpdateUserMutation
