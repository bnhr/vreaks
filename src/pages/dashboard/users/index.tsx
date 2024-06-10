import useAddUserMutation from '~/api/users/add-mutation'
import { queryClient } from '~/constant'
import UsersList from '~/features/users'
import { UserPayload } from '~/types/users'

function UserPage() {
	const mutation = useAddUserMutation()

	const addNewUser = () => {
		const payload: UserPayload = {
			name: 'user005',
			fullname: 'user005',
			username: 'user005',
			email: 'user005@mail.com',
			password: 'user005',
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
