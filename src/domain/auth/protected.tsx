import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useLoginState } from '~/store/login'

import { ChildrenProps } from '~/types'

export function ProtectedPage({ children }: ChildrenProps) {
	const { hasLoggedIn } = useLoginState()
	const navigate = useNavigate()

	useEffect(() => {
		if (!hasLoggedIn) {
			navigate('/login')
		}
	}, [hasLoggedIn, navigate])

	return <>{children}</>
}
