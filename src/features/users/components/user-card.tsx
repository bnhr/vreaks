import { useDeleteUser } from '../api/use-delete-user'
import { useUpdateUser } from '../api/use-update-user'
import { queryClient } from '~/shared/lib/react-query'
import type { User } from '../types/user.types'

export function UserCard({ user }: { user: User }) {
	const mutation = useDeleteUser()
	const updateMutation = useUpdateUser()

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
