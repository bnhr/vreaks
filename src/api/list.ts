const BASEURL = import.meta.env.VITE_BE_URL

export const authApi = {
	register: `${BASEURL}/api/auth/register`,
	login: `${BASEURL}/api/auth/login`,
	logout: `${BASEURL}/api/auth/logout`,
}

export const userApi = {
	getAllUsers: `${BASEURL}/api/users`,
	getSingleUser: (uuid: string) => `${BASEURL}/api/users/${uuid}`,
}
