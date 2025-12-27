import { Link, useNavigate } from 'react-router'
import { useMeQuery } from '~/api/auth/me-query'
import Button from '~/components/base/button/button'

function AdminPage() {
	const navigate = useNavigate()
	const { data, isLoading, isError, error } = useMeQuery()

	if (isError) {
		return <div>{error.message}</div>
	}

	if (isLoading) {
		return <div>loading...</div>
	}

	const user = data?.data

	if (!user) {
		return <div>not found</div>
	}

	return (
		<div>
			<p>admin page</p>
			<Link to={'/admin/users'}>Users</Link>
			<p>{user.username}</p>
			<p>Role: {user.role}</p>
			<Button
				onClick={() => {
					setTimeout(() => {
						navigate('/')
					}, 1000)
				}}
			>
				logout
			</Button>
		</div>
	)
}

export default AdminPage
