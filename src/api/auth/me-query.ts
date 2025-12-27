import { useQuery } from '@tanstack/react-query'
import { getMe } from '~/api/services/auth-service'
import { QUERY_CONFIG } from '~/config/api-config'

export function useMeQuery() {
	return useQuery({
		queryKey: ['me'],
		queryFn: getMe,
		staleTime: QUERY_CONFIG.STALE_TIME,
		retry: QUERY_CONFIG.RETRY,
	})
}
