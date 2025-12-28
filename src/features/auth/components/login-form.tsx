import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import Button from '~/shared/components/ui/button/button'
import { useLogin } from '../api/use-login'
import { useAuth } from '../hooks/use-auth'

function LoginForm() {
	const navigate = useNavigate()
	const { isAuthenticated } = useAuth()
	const { isError, error, mutate } = useLogin()

	function handleClick() {
		mutate(
			{ email: 'admin@example.com', password: 'Admin123!' },
			{
				onSuccess: (data) => {
					if (data.status === 'success') {
						navigate('/admin')
					}
				},
			},
		)
	}

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/admin')
		}
	}, [isAuthenticated, navigate])

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

export default LoginForm
