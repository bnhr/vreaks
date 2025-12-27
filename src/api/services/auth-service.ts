import { USE_MOCK_API } from '~/config/env'
import { authApi } from '~/api/fetchers/list'
import { apiClient } from '~/api/fetchers/api-client'
import {
	mockLogin,
	mockRegister,
	mockGetMe,
	mockRefreshToken,
	mockLogout,
} from '~/api/mock/mock-auth'
import type {
	LoginResponse,
	RegisterResponse,
	MeResponse,
	RefreshResponse,
} from '~/types/auth'

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

export async function login(payload: LoginPayload): Promise<LoginResponse> {
	if (USE_MOCK_API) {
		return mockLogin(payload)
	}

	try {
		const response = await apiClient
			.post(authApi.login, { json: payload })
			.json<LoginResponse>()
		return response
	} catch (error) {
		console.error('Login failed:', error)
		throw error
	}
}

export async function register(
	payload: RegisterPayload,
): Promise<RegisterResponse> {
	if (USE_MOCK_API) {
		return mockRegister(payload)
	}

	try {
		const response = await apiClient
			.post(authApi.register, { json: payload })
			.json<RegisterResponse>()
		return response
	} catch (error) {
		console.error('Register failed:', error)
		throw error
	}
}

export async function getMe(): Promise<MeResponse> {
	if (USE_MOCK_API) {
		return mockGetMe()
	}

	try {
		const response = await apiClient.get(authApi.me).json<MeResponse>()
		return response
	} catch (error) {
		console.error('Get me failed:', error)
		throw error
	}
}

export async function refreshToken(): Promise<RefreshResponse> {
	if (USE_MOCK_API) {
		return mockRefreshToken()
	}

	try {
		const response = await apiClient
			.get(authApi.refresh)
			.json<RefreshResponse>()
		return response
	} catch (error) {
		console.error('Refresh token failed:', error)
		throw error
	}
}

export async function logout(): Promise<{
	status: 'success'
	message: string
	meta: {
		correlation_id: string
		timestamp: string
		request_id: string
		version: string
	}
}> {
	if (USE_MOCK_API) {
		return mockLogout()
	}

	try {
		const response = await apiClient.post(authApi.logout).json<{
			status: 'success'
			message: string
			meta: {
				correlation_id: string
				timestamp: string
				request_id: string
				version: string
			}
		}>()
		return response
	} catch (error) {
		console.error('Logout failed:', error)
		throw error
	}
}
