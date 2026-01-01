import { useMutation } from '@tanstack/react-query'
import { authApi } from '~/shared/api/endpoints'
import { apiClient } from '~/shared/api/client'
import { QUERY_CONFIG } from '~/shared/api/config'

async function logout(): Promise<void> {
	try {
		await apiClient.post(authApi.logout)
	} catch (error) {
		console.error('Logout failed:', error)
		throw error
	}
}

export function useLogout() {
	return useMutation({
		mutationFn: logout,
		retry: QUERY_CONFIG.RETRY,
	})
}
