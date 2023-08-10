/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import GlobalLoader from '~/pages/GlobalLoader'

const AboutPage = lazy(() => import('~/pages/About'))
const HomePage = lazy(() => import('~/pages/Home'))
const NotFound = lazy(() => import('~/pages/NotFound'))
const Protected = lazy(() => import('~/pages/Protected'))
const Login = lazy(() => import('~/pages/Login'))
const Admin = lazy(() => import('~/pages/Admin'))

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<Suspense fallback={<GlobalLoader />}>
				<HomePage />
			</Suspense>
		),
	},
	{
		path: 'about',
		element: (
			<Suspense fallback={<GlobalLoader />}>
				<AboutPage />
			</Suspense>
		),
	},
	{
		path: 'login',
		element: (
			<Suspense fallback={<GlobalLoader />}>
				<Login />
			</Suspense>
		),
	},
	{
		path: 'admin',
		element: (
			<Suspense fallback={<GlobalLoader />}>
				<Protected>
					<Admin />
				</Protected>
			</Suspense>
		),
	},
	{
		path: '*',
		element: (
			<Suspense fallback={<GlobalLoader />}>
				<NotFound />
			</Suspense>
		),
	},
])

export default router
