import useAddUserMutation from '~/api/users/add-mutation'
import { queryClient } from '~/constant'
import UsersList from '~/features/users'
import { UserPayload } from '~/types/users'

function UserPage() {
	const mutation = useAddUserMutation()

	const addNewUser = () => {
		const payload: UserPayload = {
			name: 'user 4',
			username: 'user 4',
			email: 'user4@mail.com',
			password: 'user4',
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
				<button type="button" onClick={addNewUser}>
					Add user
				</button>
			</div>
			<p>list of users</p>
			<UsersList />
		</div>
	)
}

export default UserPage
