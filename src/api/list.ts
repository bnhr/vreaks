const BASEURL = `${import.meta.env.VITE_BE_URL}/api`

export const authApi = {
	register: `${BASEURL}/auth/register`,
	login: `${BASEURL}/auth/login`,
	logout: `${BASEURL}/auth/logout`,
}

export const userApi = {
	getAllUsers: `${BASEURL}/users`,
	getSingleUser: (uuid: string) => `${BASEURL}/users/${uuid}`,
}
