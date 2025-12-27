import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '~/api/services/users-service'
import { QUERY_CONFIG } from '~/config/api-config'

export function useAddUserMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createUser,
		retry: QUERY_CONFIG.RETRY,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
		},
	})
}
