const BASEURL = import.meta.env.VITE_BE_URL

export const usersApi = {
	getAllUsers: `${BASEURL}/api/users`,
	getSingleUser: (uuid: string) => `${BASEURL}/api/users/${uuid}`,
}
