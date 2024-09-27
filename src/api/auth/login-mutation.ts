import { useMutation } from '@tanstack/react-query'
import wretch from 'wretch'

import { authApi } from '../list'
import { LoginData } from '~/types/auth'

interface LoginPayload {
	username: string
	password: string
}

export function useLoginMutation() {
	return useMutation({
		mutationFn: async (payload: LoginPayload) => {
			try {
				const result: Promise<LoginData> = wretch(authApi.login)
					.post(payload)
					.badRequest((err) => {
						throw new Error(err.response.statusText)
					})
					.unauthorized((err) => {
						throw new Error(err.response.statusText)
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
