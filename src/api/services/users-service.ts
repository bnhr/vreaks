import { USE_MOCK_API } from '~/config/env'
import { userApi } from '~/api/fetchers/list'
import { apiClient } from '~/api/fetchers/api-client'
import {
	mockGetUsers,
	mockGetUserById,
	mockCreateUser,
	mockUpdateUser,
	mockDeleteUser,
} from '~/api/mock/mock-users'
import type {
	UserListResponse,
	UserResponse,
	UserPayload,
	UserUpdatePayload,
} from '~/types/users'

export async function getUsers(): Promise<UserListResponse> {
	if (USE_MOCK_API) {
		return mockGetUsers()
	}

	try {
		const response = await apiClient
			.get(userApi.allUsers)
			.json<UserListResponse>()
		return response
	} catch (error) {
		console.error('Get users failed:', error)
		throw error
	}
}

export async function getUserById(userId: string): Promise<UserResponse> {
	if (USE_MOCK_API) {
		return mockGetUserById(userId)
	}

	try {
		const response = await apiClient
			.get(userApi.singleUser(userId))
			.json<UserResponse>()
		return response
	} catch (error) {
		console.error('Get user failed:', error)
		throw error
	}
}

export async function createUser(payload: UserPayload): Promise<UserResponse> {
	if (USE_MOCK_API) {
		return mockCreateUser(payload)
	}

	try {
		const response = await apiClient
			.post(userApi.allUsers, {
				json: payload,
			})
			.json<UserResponse>()
		return response
	} catch (error) {
		console.error('Create user failed:', error)
		throw error
	}
}

export async function updateUser(
	userId: string,
	payload: UserUpdatePayload,
): Promise<UserResponse> {
	if (USE_MOCK_API) {
		return mockUpdateUser(userId, payload)
	}

	try {
		const response = await apiClient
			.patch(userApi.singleUser(userId), {
				json: payload,
			})
			.json<UserResponse>()
		return response
	} catch (error) {
		console.error('Update user failed:', error)
		throw error
	}
}

export async function deleteUser(userId: string): Promise<UserResponse> {
	if (USE_MOCK_API) {
		return mockDeleteUser(userId)
	}

	try {
		const response = await apiClient
			.delete(userApi.singleUser(userId))
			.json<UserResponse>()
		return response
	} catch (error) {
		console.error('Delete user failed:', error)
		throw error
	}
}
