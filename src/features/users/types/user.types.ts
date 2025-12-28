import { ApiResult, PaginatedResponse } from '~/shared/api/types'

export interface User {
	id: string
	email: string
	username: string
	first_name: string
	last_name: string
	role: 'admin' | 'user'
	status: string
	email_verified: boolean
}

export type UserListResponse = ApiResult<PaginatedResponse<User>>

export type UserResponse = ApiResult<User>

export interface UserPayload {
	email: string
	username: string
	password: string
	first_name?: string
	last_name?: string
	role?: 'admin' | 'user'
}

export interface UserUpdatePayload {
	email?: string
	username?: string
	first_name?: string
	last_name?: string
}

export interface UserEdit {
	id: string
	payload: UserUpdatePayload
}

export type Users = User
