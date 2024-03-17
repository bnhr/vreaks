import { QueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

export const token = Cookies.get('token')
export const refreshToken = Cookies.get('refresh')
