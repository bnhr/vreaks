import { Suspense } from 'react'

import { ChildrenProps } from '~/shared/types/common'
import { GlobalLoader } from './global-loader'

export function LazyComponent({ children }: ChildrenProps) {
	return <Suspense fallback={<GlobalLoader />}>{children}</Suspense>
}
