import { useAddUserMutation } from '~/api/users/add-mutation'
import { queryClient } from '~/constant'
import { QUERY_KEYS_USERS } from '~/constant/api'
import { UsersList } from '~/domain/users'
import { UserPayload } from '~/types/users'

function UserPage() {
	const mutation = useAddUserMutation()

	const addNewUser = () => {
		const payload: UserPayload = {
			name: 'user0005',
			fullname: 'user0005',
			username: 'user0005',
			email: 'user005@mail.com',
			password: 'password123456',
			role: 'user',
		}

		mutation.mutate(payload, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: QUERY_KEYS_USERS })
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
