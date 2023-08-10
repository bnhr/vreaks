import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '~/components/Button/Button'
import useLoginState from '~/store/login'

function LoginPage() {
	const { hasLoggedIn, login } = useLoginState()
	const navigate = useNavigate()

	useEffect(() => {
		if (hasLoggedIn) {
			navigate('/admin')
		}
	}, [hasLoggedIn, navigate])

	return (
		<div>
			<div>login page</div>
			<Button onClick={login}>Login</Button>
		</div>
	)
}

export default LoginPage
