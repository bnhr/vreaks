import LogOutMutation from '~/api/mutations/logout-mutation'
import useMeQuery from '~/api/queries/me-query'
import Button from '~/components/base/button/button'

function AdminPage() {
	const { data, isLoading, isError, error } = useMeQuery()

	const { isError: LOIsError, error: LOError, mutate } = LogOutMutation()

	function handleLogout() {
		mutate()
	}

	if (isError) {
		return <div>{error.message}</div>
	}

	if (LOIsError) {
		return <div>{LOError.message}</div>
	}

	if (isLoading) {
		return <div>loading...</div>
	}

	return (
		<div>
			<p>admin page</p>
			<p>{data?.data.username}</p>
			<Button onClick={handleLogout}>logout</Button>
		</div>
	)
}

export default AdminPage
