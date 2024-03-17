import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import Button from '~/components/base/button/button'
import useLoginState from '~/store/login'
import useLoginMutation from '~/api/auth/login-mutation'
import { LoginData } from '~/types/auth'

function LoginPage() {
	const navigate = useNavigate()
	const { login } = useLoginState()
	const { isError, error, mutate } = useLoginMutation()

	function handleClick() {
		mutate(
			{ username: 'user 1', password: 'user 1' },
			{
				onSuccess: (data) => {
					const res = data as LoginData
					if (data) {
						Cookies.set('token', res.data.accessToken, {
							expires: 1,
							path: '/',
							secure: true,
						})
						Cookies.set('refresh', res.data.refreshToken, {
							expires: 1,
							path: '/',
							secure: true,
						})
						login()
						navigate('/admin')
					}
				},
			},
		)
	}

	if (isError) {
		return <div>{error.message}</div>
	}

	return (
		<div>
			<div>login page</div>
			<Button onClick={handleClick}>Login</Button>
		</div>
	)
}

export default LoginPage
