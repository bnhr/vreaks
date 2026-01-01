function HomePage() {
	return (
		<main className="container mx-auto p-4 sm:p-6 md:p-8">
			<div className="mx-auto max-w-2xl">
				<h1 className="mb-6 text-3xl font-bold text-black sm:text-4xl">
					Welcome to React Router Auth System
				</h1>

				<p className="mb-6 text-base text-black sm:text-lg">
					This is a complete authentication and user management system built
					with React Router.
				</p>

				<div className="mb-8 flex flex-col gap-4 sm:flex-row">
					<a
						href="/about"
						className="flex min-h-[44px] items-center justify-center bg-black px-6 py-3 text-center font-medium text-white transition-opacity hover:opacity-80"
					>
						Learn More
					</a>
					<a
						href="/login"
						className="flex min-h-[44px] items-center justify-center border-2 border-black bg-white px-6 py-3 text-center font-medium text-black transition-opacity hover:opacity-80"
					>
						Login
					</a>
				</div>

				<div className="border-2 border-black p-4 sm:p-6">
					<h2 className="mb-4 text-xl font-bold text-black sm:text-2xl">
						Quick Links
					</h2>
					<ul className="space-y-2">
						<li>
							<a
								href="/about"
								className="flex inline-block min-h-[44px] items-center text-black underline hover:opacity-80"
							>
								About this application
							</a>
						</li>
						<li>
							<a
								href="/login"
								className="flex inline-block min-h-[44px] items-center text-black underline hover:opacity-80"
							>
								Login to your account
							</a>
						</li>
					</ul>
				</div>
			</div>
		</main>
	)
}

export default HomePage
