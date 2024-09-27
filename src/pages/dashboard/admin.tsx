import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useLogoutMutation } from '~/api/auth/logout-mutation'
import { useMeQuery } from '~/api/auth/me-query'

import Button from '~/components/base/button/button'

function AdminPage() {
	const navigate = useNavigate()
	const { data, isLoading, isError, error } = useMeQuery()

	const mutation = useLogoutMutation()

	useEffect(() => {
		if (mutation.isSuccess) {
			navigate('/')
		}
	}, [mutation.isSuccess, navigate])

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
					mutation.mutate()
				}}
			>
				logout
			</Button>
		</div>
	)
}

export default AdminPage
