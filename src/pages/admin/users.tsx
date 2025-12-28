import { useCreateUser, UserList, UserPayload } from '~/features/users'
import { queryClient } from '~/shared/lib/react-query'
import { formatDateTime } from '~/shared/utils/date'

function AdminUsersPage() {
	const mutation = useCreateUser()

	const addNewUser = () => {
		const formattedDate = formatDateTime(new Date().getTime())
		const payload: UserPayload = {
			username: `user${formattedDate}`,
			password: 'password123456',
			first_name: 'First',
			last_name: 'Last',
			role: 'user',
			email: `user${formattedDate}@mail.com`,
		}

		mutation.mutate(payload, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['users'] })
			},
		})
	}

	return (
		<div className="p-4">
			<h1 className="mb-4 text-2xl font-bold">User Management</h1>
			<button
				type="button"
				onClick={addNewUser}
			>
				Add user
			</button>
			<UserList />
		</div>
	)
}

export default AdminUsersPage
