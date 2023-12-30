import { useMutation } from '@tanstack/react-query'
import { Fetcher } from '~/api/fetcher'
import { authApi } from '../list'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import useLoginState from '~/store/login'

interface Result {
	username: string
}

interface Data {
	data: Result
}

function LogOutMutation() {
	const navigate = useNavigate()
	const { logout } = useLoginState()
	const mutation = useMutation({
		mutationFn: async () => {
			return await Fetcher<Data>(authApi.logout, 'POST', true)
		},
		onSuccess: () => {
			Cookies.remove('auth')
			Cookies.remove('authr')
			logout()
			setTimeout(() => {
				navigate('/')
			}, 1500)
		},
	})

	return mutation
}

export default LogOutMutation
