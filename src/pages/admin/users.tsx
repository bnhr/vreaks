import {
	useCreateUser,
	useUsersQuery,
	useDeleteUser,
	useUpdateUser,
	type User,
	type UserPayload,
} from '~/features/users'
import { queryClient } from '~/shared/lib/react-query'
import { formatDateTime } from '~/shared/utils/date'

function AdminUsersPage() {
	const mutation = useCreateUser()
	const { data, error, isLoading } = useUsersQuery()
	const deleteMutation = useDeleteUser()
	const updateMutation = useUpdateUser()

	const addNewUser = () => {
		const formattedDate = formatDateTime(new Date().getTime())
		const payload: UserPayload = {
			username: `user${formattedDate}`,
			password: 'password123456',
			first_name: 'First',
			last_name: 'Last',
			role: 'user',
			email: `user${formattedDate}@mail.com`,
		}

		mutation.mutate(payload, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['users'] })
			},
		})
	}

	const handleUpdateUser = (user: User) => {
		const payload = {
			first_name: `${user.first_name}_edited`,
		}

		updateMutation.mutate(
			{ id: user.id, payload },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ['users'] })
				},
			},
		)
	}

	const handleDeleteUser = (id: string) => {
		if (confirm('Are you sure you want to delete this user?')) {
			deleteMutation.mutate(id, {
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ['users'] })
				},
			})
		}
	}

	if (isLoading) {
		return (
			<div className="space-y-4">
				<h1 className="text-3xl font-bold text-black sm:text-4xl">
					Users Management
				</h1>
				<div className="flex items-center justify-center p-8">
					<div className="text-base text-black sm:text-lg">
						Loading users...
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="space-y-4">
				<h1 className="text-3xl font-bold text-black sm:text-4xl">
					Users Management
				</h1>
				<div className="border-2 border-black bg-white p-4">
					<h3 className="mb-2 font-semibold text-black">Error Loading Users</h3>
					<p className="text-black">{error.message}</p>
				</div>
			</div>
		)
	}

	const users = data?.data.data || []
	const pagination = data?.data.pagination

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-3xl font-bold text-black sm:text-4xl">
					Users Management
				</h1>
				<button
					type="button"
					onClick={addNewUser}
					disabled={mutation.isPending}
					className="min-h-[44px] bg-black px-4 py-2 text-white transition-opacity hover:opacity-80 disabled:opacity-40"
				>
					{mutation.isPending ? 'Creating...' : 'Add User'}
				</button>
			</div>

			{pagination && (
				<div className="text-sm text-black opacity-80">
					Total: {pagination.total} users
				</div>
			)}

			{users.length === 0 ? (
				<div className="border-2 border-black bg-white p-8 text-center">
					<p className="text-black">No users found</p>
				</div>
			) : (
				<div className="overflow-hidden border-2 border-black bg-white">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y-2 divide-black">
							<thead className="bg-black text-white">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase sm:px-6">
										Username
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase sm:px-6">
										Email
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase sm:px-6">
										Name
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase sm:px-6">
										Role
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase sm:px-6">
										Status
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase sm:px-6">
										Verified
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase sm:px-6">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y-2 divide-black bg-white">
								{users.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-black/5"
									>
										<td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-black sm:px-6">
											{user.username}
										</td>
										<td className="px-4 py-4 text-sm whitespace-nowrap text-black sm:px-6">
											{user.email}
										</td>
										<td className="px-4 py-4 text-sm whitespace-nowrap text-black sm:px-6">
											{user.first_name} {user.last_name}
										</td>
										<td className="px-4 py-4 text-sm whitespace-nowrap text-black sm:px-6">
											<span
												className={`inline-flex px-2 py-1 text-xs font-semibold ${
													user.role === 'admin'
														? 'bg-black text-white'
														: 'border border-black bg-white text-black'
												}`}
											>
												{user.role}
											</span>
										</td>
										<td className="px-4 py-4 text-sm whitespace-nowrap text-black sm:px-6">
											<span
												className={`inline-flex px-2 py-1 text-xs font-semibold ${
													user.status === 'active'
														? 'bg-black text-white'
														: 'border border-black bg-white text-black'
												}`}
											>
												{user.status}
											</span>
										</td>
										<td className="px-4 py-4 text-sm whitespace-nowrap text-black sm:px-6">
											{user.email_verified ? (
												<span className="text-black">✓</span>
											) : (
												<span className="text-black opacity-40">✗</span>
											)}
										</td>
										<td className="px-4 py-4 text-sm whitespace-nowrap text-black sm:px-6">
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => handleUpdateUser(user)}
													disabled={updateMutation.isPending}
													className="min-h-[44px] border-2 border-black bg-white px-3 py-1 text-black transition-opacity hover:opacity-80 disabled:opacity-40"
												>
													Edit
												</button>
												<button
													type="button"
													onClick={() => handleDeleteUser(user.id)}
													disabled={deleteMutation.isPending}
													className="min-h-[44px] bg-black px-3 py-1 text-white transition-opacity hover:opacity-80 disabled:opacity-40"
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{pagination && pagination.total_pages > 1 && (
				<div className="flex items-center justify-between border-2 border-black bg-white px-4 py-3 sm:px-6">
					<div className="text-sm text-black">
						Page {pagination.page} of {pagination.total_pages}
					</div>
					<div className="flex gap-2">
						<button
							disabled={!pagination.has_prev}
							className="min-h-[44px] border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80 disabled:opacity-40"
						>
							Previous
						</button>
						<button
							disabled={!pagination.has_next}
							className="min-h-[44px] border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80 disabled:opacity-40"
						>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default AdminUsersPage
