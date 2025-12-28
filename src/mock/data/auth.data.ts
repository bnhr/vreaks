import { MOCK_API_CONFIG } from '~/shared/api/config'
import { loadMockData, saveMockData, generateTokens } from '.'
import type {
	LoginResponse,
	RegisterResponse,
	MeResponse,
	RefreshResponse,
} from '~/features/auth'
import type { ApiError } from '~/shared/api/types'
import type { User } from '~/features/users'

interface LoginPayload {
	email: string
	password: string
}

interface RegisterPayload {
	email: string
	username: string
	password: string
	first_name: string
	last_name: string
}

async function delay() {
	if (MOCK_API_CONFIG.ENABLE_DELAYS) {
		await new Promise((resolve) =>
			setTimeout(resolve, MOCK_API_CONFIG.DELAY_MS),
		)
	}
}

export async function mockLogin(payload: LoginPayload): Promise<LoginResponse> {
	await delay()
	const data = loadMockData()

	const user = data.users.find((u: User) => u.email === payload.email)

	if (!user) {
		throw {
			status: 'error',
			code: 'INVALID_CREDENTIALS',
			message: 'Invalid email or password',
			meta: {
				correlation_id: crypto.randomUUID(),
				timestamp: new Date().toISOString(),
				request_id: crypto.randomUUID(),
				version: '1.0',
			},
		} as ApiError
	}

	const tokens = generateTokens()

	data.currentUser = user
	data.accessToken = tokens.access_token
	data.refreshToken = tokens.refresh_token
	saveMockData(data)

	return {
		status: 'success',
		message: 'Login successful',
		data: {
			user,
			expires_in: tokens.expires_in,
		},
		meta: {
			correlation_id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			request_id: crypto.randomUUID(),
			version: '1.0',
		},
	}
}

export async function mockRegister(
	payload: RegisterPayload,
): Promise<RegisterResponse> {
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
		first_name: payload.first_name,
		last_name: payload.last_name,
		role: 'user' as const,
		status: 'active',
		email_verified: false,
	}

	const tokens = generateTokens()

	data.users.push(newUser)
	data.currentUser = newUser
	data.accessToken = tokens.access_token
	data.refreshToken = tokens.refresh_token
	saveMockData(data)

	return {
		status: 'success',
		message: 'User registered successfully',
		data: {
			user: newUser,
			expires_in: tokens.expires_in,
		},
		meta: {
			correlation_id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			request_id: crypto.randomUUID(),
			version: '1.0',
		},
	}
}

export async function mockGetMe(): Promise<MeResponse> {
	await delay()
	const data = loadMockData()

	if (!data.currentUser || !data.accessToken) {
		throw {
			status: 'error',
			code: 'UNAUTHORIZED',
			message: 'Invalid or expired token',
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
		message: 'User information retrieved',
		data: data.currentUser,
		meta: {
			correlation_id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			request_id: crypto.randomUUID(),
			version: '1.0',
		},
	}
}

export async function mockRefreshToken(): Promise<RefreshResponse> {
	await delay()
	const data = loadMockData()

	if (!data.refreshToken || !data.currentUser) {
		throw {
			status: 'error',
			code: 'INVALID_REFRESH_TOKEN',
			message: 'Invalid refresh token',
			meta: {
				correlation_id: crypto.randomUUID(),
				timestamp: new Date().toISOString(),
				request_id: crypto.randomUUID(),
				version: '1.0',
			},
		} as ApiError
	}

	const tokens = generateTokens()

	data.accessToken = tokens.access_token
	data.refreshToken = tokens.refresh_token
	saveMockData(data)

	return {
		status: 'success',
		message: 'Token refreshed successfully',
		data: {
			user: data.currentUser,
			expires_in: tokens.expires_in,
		},
		meta: {
			correlation_id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			request_id: crypto.randomUUID(),
			version: '1.0',
		},
	}
}

export async function mockLogout(): Promise<{
	status: 'success'
	message: string
	meta: {
		correlation_id: string
		timestamp: string
		request_id: string
		version: string
	}
}> {
	await delay()
	const data = loadMockData()

	data.currentUser = null
	data.accessToken = null
	data.refreshToken = null
	saveMockData(data)

	return {
		status: 'success',
		message: 'Logout successful',
		meta: {
			correlation_id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			request_id: crypto.randomUUID(),
			version: '1.0',
		},
	}
}
