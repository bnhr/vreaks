import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useLogin } from '../api/use-login'
import { useAuth } from '../hooks/use-auth'

function LoginForm() {
	const navigate = useNavigate()
	const { isAuthenticated } = useAuth()
	const { isError, error, mutate, isPending } = useLogin()
	const [email, setEmail] = useState('admin@example.com')
	const [password, setPassword] = useState('Admin123!')

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		mutate(
			{ email, password },
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

	return (
		<main className="container mx-auto max-w-md px-4 py-8">
			<h1 className="mb-6 text-3xl font-bold text-black">Login</h1>

			<form
				onSubmit={handleSubmit}
				className="space-y-4"
			>
				{/* Email input - 44x44px touch target */}
				<div>
					<label
						htmlFor="email"
						className="mb-1 block text-sm font-medium text-black"
					>
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						disabled={isPending}
						className="min-h-[44px] w-full border-2 border-black px-3 py-2 text-black focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-40"
					/>
				</div>

				{/* Password input - 44x44px touch target */}
				<div>
					<label
						htmlFor="password"
						className="mb-1 block text-sm font-medium text-black"
					>
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						disabled={isPending}
						className="min-h-[44px] w-full border-2 border-black px-3 py-2 text-black focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-40"
					/>
				</div>

				{/* Error message */}
				{isError && (
					<div className="border-2 border-black bg-white p-3 text-black">
						<p className="text-sm">{error.message}</p>
					</div>
				)}

				{/* Submit button - 44x44px touch target */}
				<button
					type="submit"
					disabled={isPending}
					className="min-h-[44px] w-full bg-black px-4 py-2 font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
				>
					{isPending ? 'Logging in...' : 'Login'}
				</button>
			</form>

			<p className="mt-4 text-sm text-black">
				Don&apos;t have an account? Contact your administrator.
			</p>
		</main>
	)
}

export default LoginForm
