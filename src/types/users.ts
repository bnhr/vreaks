export interface Users {
	id: string
	username: string
}

export interface UserPayload {
	name: string
	username: string
	fullname: string
	email: string
	password: string
	role?: 'admin' | 'user'
}

export interface UserEdit {
	id: string
	payload: Partial<UserPayload>
}
