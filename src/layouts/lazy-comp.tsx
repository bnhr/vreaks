import { Suspense } from 'react'

import { ChildrenProps } from '~/types'
import GlobalLoader from './global-loader'

function LazyComponent({ children }: ChildrenProps) {
	return <Suspense fallback={<GlobalLoader />}>{children}</Suspense>
}

export default LazyComponent
