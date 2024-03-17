export interface Users {
	id: string
	username: string
}

export interface UserPayload {
	name: string
	username: string
	email: string
	password: string
	role?: 'ADMIN' | 'USER'
}

export interface UserEdit {
	id: string
	payload: Partial<UserPayload>
}
