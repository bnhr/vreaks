import { useQuery } from '@tanstack/react-query'
import { USE_MOCK_API } from '~/shared/config/env'
import { authApi } from '~/shared/api/endpoints'
import { apiClient } from '~/shared/api/client'
import { QUERY_CONFIG } from '~/shared/api/config'
import { mockGetMe } from '~/mock/handlers/auth.handlers'
import type { MeResponse } from '../types/auth.types'

async function getMe(): Promise<MeResponse> {
	if (USE_MOCK_API) {
		return mockGetMe()
	}

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
