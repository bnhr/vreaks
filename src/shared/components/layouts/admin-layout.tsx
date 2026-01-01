import { NavLink, Outlet } from 'react-router'
import { useMeQuery, useLogout } from '~/features/auth'
import { useNavigate } from 'react-router'

export function AdminLayout() {
	const navigate = useNavigate()
	const { isLoading } = useMeQuery()
	const { mutate: logout } = useLogout()

	const handleLogout = () => {
		logout(undefined, {
			onSuccess: () => {
				navigate('/login')
			},
		})
	}

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-base text-black sm:text-lg">Loading...</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<nav className="bg-black p-4 text-white">
				<div className="container mx-auto flex items-center justify-between">
					<div className="flex gap-6">
						<NavLink
							to="/admin"
							end
							className={({ isActive }) =>
								`transition-opacity hover:opacity-80 ${isActive ? 'border-b-2 border-white font-bold' : ''}`
							}
						>
							Dashboard
						</NavLink>
						<NavLink
							to="/admin/users"
							className={({ isActive }) =>
								`transition-opacity hover:opacity-80 ${isActive ? 'border-b-2 border-white font-bold' : ''}`
							}
						>
							Users
						</NavLink>
					</div>
					<button
						onClick={handleLogout}
						className="min-h-[44px] bg-white px-4 py-2 text-black transition-opacity hover:opacity-80"
					>
						Logout
					</button>
				</div>
			</nav>
			<main className="container mx-auto p-4 sm:p-6 md:p-8">
				<Outlet />
			</main>
		</div>
	)
}
