import { useAddUserMutation } from '~/api/users/add-mutation'
import { queryClient } from '~/constant'
import { UsersList } from '~/domain/users'
import { UserPayload } from '~/types/users'

function UserPage() {
	const mutation = useAddUserMutation()

	const addNewUser = () => {
		const payload: UserPayload = {
			username: `user${Date.now()}`,
			email: `user${Date.now()}@mail.com`,
			password: 'password123456',
			first_name: 'First',
			last_name: 'Last',
			role: 'user',
		}

		mutation.mutate(payload, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['users'] })
			},
		})
	}

	return (
		<div>
			<div className="mb-4">
				<button
					type="button"
					onClick={addNewUser}
				>
					Add user
				</button>
			</div>
			<p>list of users</p>
			<UsersList />
		</div>
	)
}

export default UserPage
