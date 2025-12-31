import { useMutation } from '@tanstack/react-query'
import { authApi } from '~/shared/api/endpoints'
import { apiClient } from '~/shared/api/client'
import { QUERY_CONFIG } from '~/shared/api/config'
import type { LoginResponse } from '../types/auth.types'

interface LoginPayload {
	email: string
	password: string
}

async function login(payload: LoginPayload): Promise<LoginResponse> {
	try {
		const response = await apiClient
			.post(authApi.login, { json: payload })
			.json<LoginResponse>()
		return response
	} catch (error) {
		console.error('Login failed:', error)
		throw error
	}
}

export function useLogin() {
	return useMutation({
		mutationFn: login,
		retry: QUERY_CONFIG.RETRY,
	})
}
