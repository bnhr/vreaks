import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '~/api/services/users-service'
import { QUERY_CONFIG } from '~/config/api-config'

export function useDeleteUserMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteUser,
		retry: QUERY_CONFIG.RETRY,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
		},
	})
}
