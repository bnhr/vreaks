import { useQuery } from '@tanstack/react-query'
import { Fetcher } from '../fetcher'
import { authApi } from '../list'

interface Me {
	username: string
}

interface Data {
	data: Me
}

function useMeQuery() {
	return useQuery({
		queryKey: ['me'],
		staleTime: Infinity,
		queryFn: async () => {
			return await Fetcher<Data>(authApi.me, 'GET', true)
		},
	})
}

export default useMeQuery
