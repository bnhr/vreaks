import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import Button from '~/components/base/button/button'
import { LoginData } from '~/types/auth'
import { useLoginState } from '~/store/login'
import { useLoginMutation } from '~/api/auth/login-mutation'

function LoginPage() {
	const navigate = useNavigate()
	const { login } = useLoginState()
	const { isError, error, mutate } = useLoginMutation()

	function handleClick() {
		mutate(
			{ username: 'user01', password: 'user01' },
			{
				onSuccess: (data) => {
					const res = data as LoginData
					if (res.status === 'success') {
						Cookies.set('token', res.data.access_token, {
							expires: 1,
							path: '/',
							secure: true,
						})
						Cookies.set('refresh', res.data.refresh_token, {
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
