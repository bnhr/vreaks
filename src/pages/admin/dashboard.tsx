import { useMeQuery } from '~/features/auth'

function AdminPage() {
	const { data, isLoading, isError, error } = useMeQuery()

	if (isError) {
		return (
			<div className="mx-auto max-w-4xl">
				<div className="border-2 border-black bg-white p-4">
					<h3 className="mb-2 font-semibold text-black">Error</h3>
					<p className="text-black">{error.message}</p>
				</div>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className="mx-auto max-w-4xl">
				<div className="text-base text-black sm:text-lg">Loading...</div>
			</div>
		)
	}

	const user = data?.data

	if (!user) {
		return (
			<div className="mx-auto max-w-4xl">
				<div className="border-2 border-black bg-white p-4">
					<p className="text-black">User not found</p>
				</div>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-4xl">
			{/* Welcome Message */}
			<h1 className="mb-2 text-3xl font-bold text-black sm:text-4xl">
				Welcome, {user.first_name}!
			</h1>
			<p className="mb-8 text-base text-black opacity-80 sm:text-lg">
				You are logged in as <strong>{user.email}</strong>
			</p>

			{/* User Information Card */}
			<div className="mb-8 border-2 border-black p-4 sm:p-6">
				<h2 className="mb-4 text-xl font-bold text-black sm:text-2xl">
					Your Account Information
				</h2>
				<div className="grid grid-cols-1 gap-4 text-sm text-black sm:text-base md:grid-cols-2">
					<div>
						<p className="font-semibold">Username:</p>
						<p className="opacity-80">{user.username}</p>
					</div>
					<div>
						<p className="font-semibold">Email:</p>
						<p className="opacity-80">{user.email}</p>
					</div>
					<div>
						<p className="font-semibold">Name:</p>
						<p className="opacity-80">
							{user.first_name} {user.last_name}
						</p>
					</div>
					<div>
						<p className="font-semibold">Role:</p>
						<p className="opacity-80">
							<span
								className={`inline-block px-3 py-1 ${
									user.role === 'admin'
										? 'bg-black text-white'
										: 'border border-black bg-white text-black'
								}`}
							>
								{user.role}
							</span>
						</p>
					</div>
					<div>
						<p className="font-semibold">Status:</p>
						<p className="opacity-80">
							<span
								className={`inline-block px-3 py-1 ${
									user.status === 'active'
										? 'bg-black text-white'
										: 'border border-black bg-white text-black'
								}`}
							>
								{user.status}
							</span>
						</p>
					</div>
					<div>
						<p className="font-semibold">Email Verified:</p>
						<p className="opacity-80">
							{user.email_verified ? (
								<span className="text-black">✓ Verified</span>
							) : (
								<span className="text-black">✗ Not Verified</span>
							)}
						</p>
					</div>
				</div>
			</div>

			{/* Management Links */}
			<div className="border-2 border-black p-4 sm:p-6">
				<h2 className="mb-4 text-xl font-bold text-black sm:text-2xl">
					Management
				</h2>
				<p className="mb-6 text-sm text-black opacity-80 sm:text-base">
					Access administrative features and manage system resources.
				</p>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{/* User Management Card */}
					<a
						href="/admin/users"
						className="group block min-h-[44px] border-2 border-black p-4 transition-colors hover:bg-black hover:text-white sm:p-6"
					>
						<h3 className="mb-2 text-lg font-bold sm:text-xl">
							User Management
						</h3>
						<p className="text-sm opacity-80 group-hover:opacity-100 sm:text-base">
							View, create, edit, and delete user accounts. Manage user roles
							and permissions.
						</p>
						<div className="mt-4 text-sm font-semibold">Go to Users →</div>
					</a>

					{/* Dashboard Stats Card (placeholder for future features) */}
					<div className="border-2 border-black p-4 opacity-40 sm:p-6">
						<h3 className="mb-2 text-lg font-bold sm:text-xl">
							Dashboard Stats
						</h3>
						<p className="text-sm opacity-80 sm:text-base">
							View system statistics and analytics. Coming soon.
						</p>
						<div className="mt-4 text-sm font-semibold">Coming Soon</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AdminPage
