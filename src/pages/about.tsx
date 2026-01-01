function AboutPage() {
	return (
		<main className="container mx-auto p-4 sm:p-6 md:p-8">
			<div className="mx-auto max-w-3xl">
				<h1 className="mb-6 text-3xl font-bold text-black sm:text-4xl">
					About This Application
				</h1>

				<p className="mb-8 text-base text-black sm:text-lg">
					This is a complete authentication and user management system built
					with React Router that demonstrates modern web development practices
					and secure authentication patterns.
				</p>

				<div className="mb-6 border-2 border-black p-4 sm:p-6">
					<h2 className="mb-4 text-xl font-bold text-black sm:text-2xl">
						Features
					</h2>
					<ul className="space-y-3 text-sm text-black sm:text-base">
						<li className="flex items-start">
							<span className="mr-2">•</span>
							<span>
								<strong>Cookie-based Authentication:</strong> Secure HTTP-only
								cookies for token storage
							</span>
						</li>
						<li className="flex items-start">
							<span className="mr-2">•</span>
							<span>
								<strong>Automatic Token Refresh:</strong> Seamless session
								management with automatic token renewal
							</span>
						</li>
						<li className="flex items-start">
							<span className="mr-2">•</span>
							<span>
								<strong>Protected Routes:</strong> Client-side authentication
								verification for admin pages
							</span>
						</li>
						<li className="flex items-start">
							<span className="mr-2">•</span>
							<span>
								<strong>User Management:</strong> Full CRUD operations for
								managing user accounts
							</span>
						</li>
						<li className="flex items-start">
							<span className="mr-2">•</span>
							<span>
								<strong>Responsive Design:</strong> Mobile-first design that
								works on all devices
							</span>
						</li>
						<li className="flex items-start">
							<span className="mr-2">•</span>
							<span>
								<strong>Black & White Theme:</strong> Clean, high-contrast
								interface for optimal readability
							</span>
						</li>
						<li className="flex items-start">
							<span className="mr-2">•</span>
							<span>
								<strong>Type Safety:</strong> Full TypeScript support for
								compile-time error checking
							</span>
						</li>
					</ul>
				</div>

				<div className="mb-6 border-2 border-black p-4 sm:p-6">
					<h2 className="mb-4 text-xl font-bold text-black sm:text-2xl">
						Technology Stack
					</h2>
					<ul className="space-y-2 text-sm text-black sm:text-base">
						<li>
							<strong>Framework:</strong> React Router
						</li>
						<li>
							<strong>Language:</strong> TypeScript
						</li>
						<li>
							<strong>Styling:</strong> Tailwind CSS
						</li>
						<li>
							<strong>State Management:</strong> TanStack Query
						</li>
						<li>
							<strong>Authentication:</strong> Cookie-based with JWT tokens
						</li>
					</ul>
				</div>

				<div className="flex flex-col gap-4 sm:flex-row">
					<a
						href="/"
						className="flex min-h-[44px] items-center justify-center border-2 border-black bg-white px-6 py-3 text-center text-black transition-opacity hover:opacity-80"
					>
						Back to Home
					</a>
					<a
						href="/login"
						className="flex min-h-[44px] items-center justify-center bg-black px-6 py-3 text-center text-white transition-opacity hover:opacity-80"
					>
						Get Started
					</a>
				</div>
			</div>
		</main>
	)
}

export default AboutPage
