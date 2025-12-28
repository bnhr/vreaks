import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ChildrenProps } from '~/shared/types/common'
import { useAuth } from '../hooks/use-auth'

export function ProtectedRoute({ children }: ChildrenProps) {
	const { isAuthenticated, isLoading } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate('/login')
		}
	}, [isAuthenticated, isLoading, navigate])

	if (isLoading) {
		return <div>Loading...</div>
	}

	return <>{children}</>
}
