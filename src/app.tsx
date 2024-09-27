import { lazy } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './constant'
import { LazyComponent } from './layouts/lazy-comp'
import { AdminLayout } from './layouts/admin/admin-layout'
import { ProtectedPage } from './pages/auth/protected'

const AboutPage = lazy(() => import('~/pages/front/about'))
const HomePage = lazy(() => import('~/pages/front/home'))
const NotFound = lazy(() => import('~/pages/errors/not-found'))
const Login = lazy(() => import('~/pages/auth/login'))
const Admin = lazy(() => import('~/pages/dashboard/admin'))
const Users = lazy(() => import('~/pages/dashboard/users'))

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<LazyComponent>
				<HomePage />
			</LazyComponent>
		),
	},
	{
		path: 'about',
		element: (
			<LazyComponent>
				<AboutPage />
			</LazyComponent>
		),
	},
	{
		path: 'login',
		element: (
			<LazyComponent>
				<Login />
			</LazyComponent>
		),
	},
	{
		path: 'admin',
		element: (
			<ProtectedPage>
				<AdminLayout />
			</ProtectedPage>
		),
		children: [
			{
				index: true,
				element: (
					<LazyComponent>
						<Admin />
					</LazyComponent>
				),
			},
			{
				path: 'users',
				element: (
					<LazyComponent>
						<Users />
					</LazyComponent>
				),
			},
		],
	},
	{
		path: '*',
		element: <NotFound />,
	},
])

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<RouterProvider router={router} />
		</QueryClientProvider>
	)
}

export default App
