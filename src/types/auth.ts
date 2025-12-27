import { ApiResult, ApiMeta } from './api'

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

export interface LoginData {
	user: User
	expires_in: number
}

export type LoginResponse = ApiResult<LoginData>

export type MeResponse = ApiResult<User>

export interface RegisterData {
	user: User
	expires_in: number
}

export type RegisterResponse = ApiResult<RegisterData>

export interface RefreshData {
	user: User
	expires_in: number
}

export type RefreshResponse = ApiResult<RefreshData>

export interface SuccessResponse {
	status: 'success'
	message: string
	meta: ApiMeta
}
