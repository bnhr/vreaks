export interface ApiResponse<T> {
	status: 'success' | 'error'
	message: string
	data: T
	meta: ApiMeta
}

export interface ApiError {
	status: 'error'
	code: string
	message: string
	errors?: ValidationError[]
	meta: ApiMeta
}

export interface ValidationError {
	field: string
	message: string
	code: string
}

export interface ApiMeta {
	correlation_id: string
	timestamp: string
	request_id: string
	version: string
}

export interface Pagination {
	total: number
	page: number
	per_page: number
	total_pages: number
	has_next: boolean
	has_prev: boolean
	next_page: number | null
	prev_page: number | null
}

export interface PaginatedResponse<T> {
	data: T[]
	pagination: Pagination
}

export type ApiResult<T> = ApiResponse<T>

export interface SuccessResult<T> {
	statusCode: number
	message: string
	data: T
}
