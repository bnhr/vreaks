import { useNavigate } from 'react-router-dom'

import Button from '~/components/base/button/button'
import useLoginState from '~/store/login'
import LoginMutation from '~/api/mutations/login-mutation'

function LoginPage() {
	const navigate = useNavigate()
	const { login } = useLoginState()
	const { isError, error, mutate } = LoginMutation()

	function handleClick() {
		mutate(
			{ username: 'pino1', password: 'pino1' },
			{
				onSuccess: (data) => {
					if (data) {
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
