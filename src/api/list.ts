export const BASEURL = `${import.meta.env.VITE_BE_URL}/api`

export const authApi = {
	register: `${BASEURL}/auth/register`,
	login: `${BASEURL}/auth/login`,
	me: `${BASEURL}/auth/me`,
	refresh: `${BASEURL}/auth/refresh`,
	logout: `${BASEURL}/auth/logout`,
}

export const userApi = {
	allUsers: `${BASEURL}/users`,
	singleUser: (uuid: string) => `${BASEURL}/users/${uuid}`,
}
