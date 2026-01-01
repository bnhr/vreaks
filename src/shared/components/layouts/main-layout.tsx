import { NavLink, Outlet, useNavigation } from 'react-router'
import { GlobalLoader } from './global-loader'
import { useState } from 'react'

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
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<nav className="bg-black p-4 text-white">
			<div className="container mx-auto">
				{/* Desktop Navigation */}
				<div className="hidden gap-6 md:flex">
					<ActiveLink
						to="/"
						name="Home"
					/>
					<ActiveLink
						to="/about"
						name="About"
					/>
					<ActiveLink
						to="/login"
						name="Login"
					/>
				</div>

				{/* Mobile Navigation */}
				<div className="md:hidden">
					{/* Mobile Menu Button - 44x44px touch target */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="flex h-11 w-11 items-center justify-center text-white transition-opacity hover:opacity-80"
						aria-label="Toggle menu"
						aria-expanded={mobileMenuOpen}
					>
						{mobileMenuOpen ? (
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						) : (
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						)}
					</button>

					{/* Mobile Menu Dropdown */}
					{mobileMenuOpen && (
						<div className="mt-4 flex flex-col space-y-4">
							<ActiveLink
								to="/"
								name="Home"
								onClick={() => setMobileMenuOpen(false)}
							/>
							<ActiveLink
								to="/about"
								name="About"
								onClick={() => setMobileMenuOpen(false)}
							/>
							<ActiveLink
								to="/login"
								name="Login"
								onClick={() => setMobileMenuOpen(false)}
							/>
						</div>
					)}
				</div>
			</div>
		</nav>
	)
}

function ActiveLink({
	to,
	name,
	onClick,
}: {
	to: string
	name: string
	onClick?: () => void
}) {
	return (
		<NavLink
			to={to}
			onClick={onClick}
			className={({ isActive }) =>
				`transition-opacity hover:opacity-80 ${isActive ? 'border-b-2 border-white font-bold' : ''}`
			}
		>
			{name}
		</NavLink>
	)
}
