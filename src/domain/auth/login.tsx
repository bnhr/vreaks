import { useNavigate } from 'react-router'

import Button from '~/components/base/button/button'
import { useLoginState } from '~/store/login'
import { useLoginMutation } from '~/api/auth/login-mutation'
import { useEffect } from 'react'

function LoginPage() {
	const navigate = useNavigate()
	const { hasLoggedIn, login } = useLoginState()
	const { isError, error, mutate } = useLoginMutation()

	function handleClick() {
		mutate(
			{ username: 'user0001', password: 'password123' },
			{
				onSuccess: (data) => {
					const res = data

					if (res.status === 'success') {
						login()
						navigate('/admin')
					}
				},
			},
		)
	}

	useEffect(() => {
		if (hasLoggedIn) {
			navigate('/admin')
		}
	}, [hasLoggedIn, navigate])

	if (isError) {
		return <div>{error.message}</div>
	}

	return (
		<div className="p-4">
			<p>login today</p>
			<Button onClick={handleClick}>Login</Button>
		</div>
	)
}

export default LoginPage
