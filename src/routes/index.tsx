import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'

import { LazyComponent } from '~/components/layouts/lazy-comp'
import { ProtectedPage } from '~/domain/auth/protected'
import { AdminLayout } from '~/components/layouts/admin/admin-layout'
import { queryClient } from '~/constant'
import { MainLayout } from '~/components/layouts/main-layout'

const AboutPage = lazy(() => import('~/domain/about/about'))
const HomePage = lazy(() => import('~/domain/home/home'))
const NotFoundPage = lazy(() => import('~/domain/errors/not-found'))
const LoginPage = lazy(() => import('~/domain/auth/login'))
const AdminPage = lazy(() => import('~/domain/dashboard/admin'))
const UsersPage = lazy(() => import('~/domain/dashboard/user'))

const router = createBrowserRouter([
	{
		path: '/',
		Component: MainLayout,
		children: [
			{
				index: true,
				Component: () => (
					<LazyComponent>
						<HomePage />
					</LazyComponent>
				),
			},
			{
				path: 'about',
				Component: () => (
					<LazyComponent>
						<AboutPage />
					</LazyComponent>
				),
			},
			{
				path: 'login',
				Component: () => (
					<LazyComponent>
						<LoginPage />
					</LazyComponent>
				),
			},
			{
				path: 'admin',
				Component: () => (
					<ProtectedPage>
						<AdminLayout />
					</ProtectedPage>
				),
				children: [
					{
						index: true,
						Component: () => (
							<LazyComponent>
								<AdminPage />
							</LazyComponent>
						),
					},
					{
						path: 'users',
						Component: () => (
							<LazyComponent>
								<UsersPage />
							</LazyComponent>
						),
					},
				],
			},
			{
				path: '*',
				Component: NotFoundPage,
			},
		],
	},
])

function Root() {
	return (
		<QueryClientProvider client={queryClient}>
			{import.meta.env.VITE_MODE !== 'production' ? (
				<ReactQueryDevtools initialIsOpen={false} />
			) : null}
			<RouterProvider router={router} />
		</QueryClientProvider>
	)
}

export default Root
