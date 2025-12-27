import { useUsersQuery } from '~/api/users/users-query'
import { UserCard } from './user-card'

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
			{data?.data.data?.map((user) => (
				<div
					key={user.id}
					className="py-2"
				>
					<UserCard user={user} />
				</div>
			))}
		</>
	)
}
