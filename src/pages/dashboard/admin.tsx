import Cookies from 'js-cookie'
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

	return (
		<div>
			<p>admin page</p>
			<Link to={'/admin/users'}>Users</Link>
			<p>{data?.data.username}</p>
			<Button
				onClick={() => {
					Cookies.remove('token')
					Cookies.remove('refresh')
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
