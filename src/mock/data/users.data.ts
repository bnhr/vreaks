import { MOCK_API_CONFIG } from '~/shared/api/config'
import { loadMockData, saveMockData } from '.'
import type {
	UserListResponse,
	UserResponse,
	UserPayload,
	UserUpdatePayload,
	User,
} from '~/features/users/types/user.types'
import type { ApiError } from '~/shared/api/types'

async function delay() {
	if (MOCK_API_CONFIG.ENABLE_DELAYS) {
		await new Promise((resolve) =>
			setTimeout(resolve, MOCK_API_CONFIG.DELAY_MS),
		)
	}
}

export async function mockGetUsers(): Promise<UserListResponse> {
	await delay()
	const data = loadMockData()

	return {
		status: 'success',
		message: 'Users retrieved successfully',
		data: {
			data: data.users,
			pagination: {
				total: data.users.length,
				page: 1,
				per_page: data.users.length,
				total_pages: 1,
				has_next: false,
				has_prev: false,
				next_page: null,
				prev_page: null,
			},
		},
		meta: {
			correlation_id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			request_id: crypto.randomUUID(),
			version: '1.0',
		},
	}
}

export async function mockGetUserById(userId: string): Promise<UserResponse> {
	await delay()
	const data = loadMockData()

	const user = data.users.find((u: User) => u.id === userId)

	if (!user) {
		throw {
			status: 'error',
			code: 'USER_NOT_FOUND',
			message: 'User not found',
			meta: {
				correlation_id: crypto.randomUUID(),
				timestamp: new Date().toISOString(),
				request_id: crypto.randomUUID(),
				version: '1.0',
			},
		} as ApiError
	}

	return {
		status: 'success',
		message: 'User retrieved successfully',
		data: user,
		meta: {
			correlation_id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			request_id: crypto.randomUUID(),
			version: '1.0',
		},
	}
}

export async function mockCreateUser(
	payload: UserPayload,
): Promise<UserResponse> {
	await delay()
	const data = loadMockData()

	const existingUser = data.users.find(
		(u: User) => u.email === payload.email || u.username === payload.username,
	)

	if (existingUser) {
		throw {
			status: 'error',
			code: 'USER_ALREADY_EXISTS',
			message: 'User with this email or username already exists',
			meta: {
				correlation_id: crypto.randomUUID(),
				timestamp: new Date().toISOString(),
				request_id: crypto.randomUUID(),
				version: '1.0',
			},
		} as ApiError
	}

	const newUser = {
		id: crypto.randomUUID(),
		email: payload.email,
		username: payload.username,
		first_name: payload.first_name || '',
		last_name: payload.last_name || '',
		role: payload.role || 'user',
		status: 'active',
		email_verified: false,
	}

	data.users.push(newUser)
	saveMockData(data)

	return {
		status: 'success',
		message: 'User created successfully',
		data: newUser,
		meta: {
			correlation_id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			request_id: crypto.randomUUID(),
			version: '1.0',
		},
	}
}

export async function mockUpdateUser(
	userId: string,
	payload: UserUpdatePayload,
): Promise<UserResponse> {
	await delay()
	const data = loadMockData()

	const userIndex = data.users.findIndex((u: User) => u.id === userId)

	if (userIndex === -1) {
		throw {
			status: 'error',
			code: 'USER_NOT_FOUND',
			message: 'User not found',
			meta: {
				correlation_id: crypto.randomUUID(),
				timestamp: new Date().toISOString(),
				request_id: crypto.randomUUID(),
				version: '1.0',
			},
		} as ApiError
	}

	const user = data.users[userIndex]

	const emailTaken =
		payload.email &&
		data.users.some((u: User) => u.email === payload.email && u.id !== userId)
	const usernameTaken =
		payload.username &&
		data.users.some(
			(u: User) => u.username === payload.username && u.id !== userId,
		)

	if (emailTaken || usernameTaken) {
		throw {
			status: 'error',
			code: 'USER_ALREADY_EXISTS',
			message: 'User with this email or username already exists',
			meta: {
				correlation_id: crypto.randomUUID(),
				timestamp: new Date().toISOString(),
				request_id: crypto.randomUUID(),
				version: '1.0',
			},
		} as ApiError
	}

	const updatedUser = {
		...user,
		...payload,
		updated_at: new Date().toISOString(),
	}

	data.users[userIndex] = updatedUser

	if (data.currentUser?.id === userId) {
		data.currentUser = updatedUser
	}

	saveMockData(data)

	return {
		status: 'success',
		message: 'User updated successfully',
		data: updatedUser,
		meta: {
			correlation_id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			request_id: crypto.randomUUID(),
			version: '1.0',
		},
	}
}

export async function mockDeleteUser(userId: string): Promise<UserResponse> {
	await delay()
	const data = loadMockData()

	const userIndex = data.users.findIndex((u: User) => u.id === userId)

	if (userIndex === -1) {
		throw {
			status: 'error',
			code: 'USER_NOT_FOUND',
			message: 'User not found',
			meta: {
				correlation_id: crypto.randomUUID(),
				timestamp: new Date().toISOString(),
				request_id: crypto.randomUUID(),
				version: '1.0',
			},
		} as ApiError
	}

	const deletedUser = data.users.splice(userIndex, 1)[0]

	if (data.currentUser?.id === userId) {
		data.currentUser = null
		data.accessToken = null
		data.refreshToken = null
	}

	saveMockData(data)

	return {
		status: 'success',
		message: 'User deleted successfully',
		data: deletedUser,
		meta: {
			correlation_id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			request_id: crypto.randomUUID(),
			version: '1.0',
		},
	}
}
