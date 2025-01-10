import { useNavigate } from 'react-router'
import Cookies from 'js-cookie'

import Button from '~/components/base/button/button'
import { useLoginState } from '~/store/login'
import { useLoginMutation } from '~/api/auth/login-mutation'

function LoginPage() {
	const navigate = useNavigate()
	const { login } = useLoginState()
	const { isError, error, mutate } = useLoginMutation()

	function handleClick() {
		mutate(
			{ username: 'user0001', password: 'user0001' },
			{
				onSuccess: (data) => {
					const res = data

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
