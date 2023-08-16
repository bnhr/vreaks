import Button from '~/components/button/button'
import useLoginState from '~/store/login'

function AdminPage() {
	const { logout } = useLoginState()
	return (
		<div>
			<p>admin page</p>
			<Button onClick={logout}>logout</Button>
		</div>
	)
}

export default AdminPage
