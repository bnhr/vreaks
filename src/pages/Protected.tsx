import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useLoginState from '~/store/login'
import { ChildrenProps } from '~/types'

function ProtectedPage({ children }: ChildrenProps) {
	const { hasLoggedIn } = useLoginState()
	const navigate = useNavigate()

	useEffect(() => {
		if (!hasLoggedIn) {
			navigate('/login')
		}
	}, [hasLoggedIn, navigate])

	return <>{children}</>
}

export default ProtectedPage
