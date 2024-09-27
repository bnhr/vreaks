import { useMutation } from '@tanstack/react-query'
import wretch from 'wretch'
import Cookies from 'js-cookie'

import { authApi } from '../list'
import { token } from '~/constant'
import { generateToken } from '../refresh'

export function useLogoutMutation() {
	return useMutation({
		mutationFn: async () => {
			try {
				const result = wretch(authApi.logout)
					.auth(`Bearer ${token}`)
					.post()
					.badRequest((err) => {
						throw new Error(err.response.statusText)
					})
					.unauthorized(async () => {
						generateToken()
						await wretch(authApi.logout).auth(`Bearer ${token}`).post().json()
					})
					.internalError((err) => {
						throw new Error(err.response.statusText)
					})
					.res((res) => {
						if (res.status === 200) {
							Cookies.remove('token')
							Cookies.remove('refresh')
						}
					})

				return result
			} catch (error) {
				console.log('🚀 ~ mutationFn: ~ error:', error)
				throw error
			}
		},
	})
}
