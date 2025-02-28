import { useMutation } from '@tanstack/react-query'

import { kyAPI } from '~/api/fetchers/ky'
import { authApi } from '~/api/fetchers/list'

import { LoginData } from '~/types/auth'

interface LoginPayload {
	username: string
	password: string
}

export function useLoginMutation() {
	return useMutation({
		mutationFn: async (payload: LoginPayload) => {
			try {
				const result = await kyAPI
					.post(authApi.login, {
						json: payload,
					})
					.json<LoginData>()
				return result
			} catch (error) {
				console.log('🚀 ~ mutationFn: ~ error:', error)
				throw error
			}
		},
	})
}
