/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import GlobalLoader from '~/pages/global-loader'

const AboutPage = lazy(() => import('~/pages/about'))
const HomePage = lazy(() => import('~/pages/home'))
const NotFound = lazy(() => import('~/pages/not-found'))
const Protected = lazy(() => import('~/pages/protected'))
const Login = lazy(() => import('~/pages/login'))
const Admin = lazy(() => import('~/pages/admin'))

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
		element: <NotFound />,
	},
])

export default router
