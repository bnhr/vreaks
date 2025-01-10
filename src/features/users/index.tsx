import { useUsersQuery } from '~/api/users/users-query'
import { UsserCard } from './user-card'

export function UsersList() {
	const { data, error, isLoading } = useUsersQuery()

	if (error) {
		return <div>error.</div>
	}

	if (isLoading) {
		return <div>loading...</div>
	}

	return (
		<>
			{data?.data.map((user) => (
				<div key={user.uuid} className="py-2">
					<UsserCard uuid={user.uuid} username={user.username} />
				</div>
			))}
		</>
	)
}
