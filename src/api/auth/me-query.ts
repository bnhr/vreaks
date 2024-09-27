import { useQuery } from '@tanstack/react-query'
import wretch from 'wretch'
import Cookies from 'js-cookie'

import { authApi } from '../list'
import { SuccessResult } from '~/types'
import { generateToken } from '../refresh'

interface Me {
	username: string
}

export function useMeQuery() {
	return useQuery({
		queryKey: ['me'],
		staleTime: Infinity,
		queryFn: async () => {
			const token = Cookies.get('token')
			try {
				const result: Promise<SuccessResult<Me>> = wretch(authApi.me)
					.auth(`Bearer ${token}`)
					.get()
					.badRequest((err) => {
						throw new Error(err.response.statusText)
					})
					.unauthorized(async () => {
						generateToken()

						await wretch(authApi.me).auth(`Bearer ${token}`).get().json()
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
