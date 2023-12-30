import useMeQuery from '~/api/queries/me-query'
import Button from '~/components/base/button/button'
import useLoginState from '~/store/login'

function AdminPage() {
	const { data, isLoading, isError, error } = useMeQuery()
	const { logout } = useLoginState()

	if (isError) {
		return <div>{error.message}</div>
	}

	if (isLoading) {
		return <div>loading...</div>
	}

	return (
		<div>
			<p>admin page</p>
			<p>{data?.data.username}</p>
			<Button onClick={logout}>logout</Button>
		</div>
	)
}

export default AdminPage
