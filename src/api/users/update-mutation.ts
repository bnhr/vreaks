import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '~/api/services/users-service'
import { QUERY_CONFIG } from '~/config/api-config'
import { UserUpdatePayload } from '~/types/users'

export function useUpdateUserMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UserUpdatePayload }) =>
			updateUser(id, payload),
		retry: QUERY_CONFIG.RETRY,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
		},
	})
}
