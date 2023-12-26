import { Suspense, lazy } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import GlobalLoader from '~/layouts/global-loader'

const AboutPage = lazy(() => import('~/pages/front/about'))
const HomePage = lazy(() => import('~/pages/front/home'))
const NotFound = lazy(() => import('~/pages/errors/not-found'))
const Protected = lazy(() => import('~/pages/auth/protected'))
const Login = lazy(() => import('~/pages/auth/login'))
const Admin = lazy(() => import('~/pages/dashboard/admin'))

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

function App() {
	return (
		<>
			<RouterProvider router={router} />
		</>
	)
}

export default App
