import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '~/components/base/button/button'
import useLoginState from '~/store/login'

function LoginPage() {
	const { hasLoggedIn, login } = useLoginState()
	const navigate = useNavigate()

	const handleClick = async () => {
		login()
	}

	useEffect(() => {
		if (hasLoggedIn) {
			navigate('/admin')
		}
	}, [hasLoggedIn, navigate])

	return (
		<div>
			<div>login page</div>
			<Button onClick={handleClick}>Login</Button>
		</div>
	)
}

export default LoginPage
