import useDeleteUserMutation from '~/api/users/delete-mutation'
import useUpdateUserMutation from '~/api/users/update-mutation'
import { queryClient } from '~/constant'
import { UserPayload, Users } from '~/types/users'

function UsserCard({ id, username }: Users) {
	const mutation = useDeleteUserMutation()
	const updateMutation = useUpdateUserMutation()

	const handleDeleteUser = (id: string) => {
		console.log('id is', id)
		mutation.mutate(id, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['users'] })
			},
		})
	}

	const handleUpdateUser = (id: string) => {
		console.log('id is', id)

		const payload: Partial<UserPayload> = {
			name: 'pino4 edit',
			username: 'pino4 edit',
			email: 'pino4@mail.com',
			password: 'pino4',
		}

		const data = {
			id,
			payload,
		}

		updateMutation.mutate(data, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['users'] })
			},
		})
	}

	return (
		<div>
			<p>{username}</p>
			<div className="flex items-center gap-2">
				<button type="button" onClick={() => handleUpdateUser(id)}>
					update
				</button>
				<button type="button" onClick={() => handleDeleteUser(id)}>
					delete
				</button>
			</div>
		</div>
	)
}

export default UsserCard
