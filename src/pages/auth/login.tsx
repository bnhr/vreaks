import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '~/components/base/button/button'
import useLoginState from '~/store/login'
import LoginMutation from '~/api/mutations/login-mutation'

function LoginPage() {
	const { login, hasLoggedIn } = useLoginState()
	console.log('🚀 ~ file: login.tsx:10 ~ LoginPage ~ hasLoggedIn:', hasLoggedIn)
	const navigate = useNavigate()
	const mutation = LoginMutation()

	function handleClick() {
		console.log('click')
		login()
		mutation.mutate({ username: 'pino1', password: 'pino1' })
	}

	useEffect(() => {
		if (hasLoggedIn) {
			navigate('/admin')
		}
	}, [hasLoggedIn, navigate])

	if (mutation.error) {
		return <div>{mutation.error.message}</div>
	}

	return (
		<div>
			<div>login page</div>
			<Button onClick={handleClick}>Login</Button>
		</div>
	)
}

export default LoginPage
