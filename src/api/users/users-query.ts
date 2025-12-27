import { useQuery } from '@tanstack/react-query'
import { getUsers } from '~/api/services/users-service'
import { QUERY_CONFIG } from '~/config/api-config'

export function useUsersQuery() {
	return useQuery({
		queryKey: ['users'],
		queryFn: getUsers,
		staleTime: QUERY_CONFIG.STALE_TIME,
		retry: QUERY_CONFIG.RETRY,
	})
}
