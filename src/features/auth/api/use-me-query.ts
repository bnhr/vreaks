import { useQuery } from '@tanstack/react-query'
import { authApi } from '~/shared/api/endpoints'
import { apiClient } from '~/shared/api/client'
import { QUERY_CONFIG } from '~/shared/api/config'
import type { MeResponse } from '../types/auth.types'

async function getMe(): Promise<MeResponse> {
	try {
		const response = await apiClient.get(authApi.me).json<MeResponse>()
		return response
	} catch (error) {
		console.error('Get me failed:', error)
		throw error
	}
}

export function useMeQuery() {
	return useQuery({
		queryKey: ['me'],
		queryFn: getMe,
		staleTime: QUERY_CONFIG.STALE_TIME,
		retry: QUERY_CONFIG.RETRY,
	})
}
