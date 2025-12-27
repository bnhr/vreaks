import { useMutation } from '@tanstack/react-query'
import { login } from '~/api/services/auth-service'
import { QUERY_CONFIG } from '~/config/api-config'

export function useLoginMutation() {
	return useMutation({
		mutationFn: login,
		retry: QUERY_CONFIG.RETRY,
	})
}
