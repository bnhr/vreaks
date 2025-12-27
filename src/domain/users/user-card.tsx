import { useDeleteUserMutation } from '~/api/users/delete-mutation'
import { useUpdateUserMutation } from '~/api/users/update-mutation'
import { queryClient } from '~/constant'
import { User } from '~/types/users'

export function UserCard({ user }: { user: User }) {
	const mutation = useDeleteUserMutation()
	const updateMutation = useUpdateUserMutation()

	const handleDeleteUser = (id: string) => {
		mutation.mutate(id, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['users'] })
			},
		})
	}

	const handleUpdateUser = (id: string) => {
		const payload = {
			first_name: `${user.first_name}_edited`,
		}

		updateMutation.mutate(
			{ id, payload },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ['users'] })
				},
			},
		)
	}

	return (
		<div>
			<p>
				<strong>Username:</strong> {user.username}
			</p>
			<p>
				<strong>First Name:</strong> {user.first_name}
			</p>
			<p>
				<strong>Email:</strong> {user.email}
			</p>
			<p>
				<strong>Role:</strong> {user.role}
			</p>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => handleUpdateUser(user.id)}
				>
					update
				</button>
				<button
					type="button"
					onClick={() => handleDeleteUser(user.id)}
				>
					delete
				</button>
			</div>
		</div>
	)
}
