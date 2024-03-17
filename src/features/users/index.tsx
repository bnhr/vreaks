import useUsersQuery from '~/api/users/users-query'
import UsserCard from './user-card'

function UsersList() {
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
				<div key={user.id} className="py-2">
					<UsserCard id={user.id} username={user.username} />
				</div>
			))}
		</>
	)
}

export default UsersList
