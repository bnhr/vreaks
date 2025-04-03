import { NavLink, Outlet, useNavigation } from 'react-router'
import { GlobalLoader } from './global-loader'
import { cn } from '~/utils'

export function MainLayout() {
	const navigation = useNavigation()
	const isNavigating = Boolean(navigation.location)

	return (
		<div className="relative h-full">
			{isNavigating && <GlobalLoader />}
			<Header />
			<main>
				<Outlet />
			</main>
		</div>
	)
}

function Header() {
	return (
		<header className="flex items-center justify-between p-4">
			<div className="flex gap-4">
				<ActiveLink
					to="/"
					name="Home"
				/>
				<ActiveLink
					to="/about"
					name="About"
				/>
			</div>
			<div>
				<ActiveLink
					to="/login"
					name="Login"
				/>
			</div>
		</header>
	)
}

function ActiveLink({ to, name }: { to: string; name: string }) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				cn('border-b pb-2', {
					'border-neutral-700': isActive,
					'border-transparent': !isActive,
				})
			}
		>
			{name}
		</NavLink>
	)
}
