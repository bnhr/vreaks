import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'

import { LazyComponent } from '~/shared/components/layouts/lazy-comp'
import { ProtectedRoute } from '~/features/auth'
import { AdminLayout } from '~/shared/components/layouts/admin-layout'
import { queryClient } from '~/shared/lib/react-query'
import { MainLayout } from '~/shared/components/layouts/main-layout'
import HomePage from '~/pages/home'
import AboutPage from '~/pages/about'
import LoginPage from '~/pages/login'

const NotFoundPage = lazy(() => import('~/pages/not-found'))
const AdminPage = lazy(() => import('~/pages/admin/dashboard'))
const AdminUsersPage = lazy(() => import('~/pages/admin/users'))

const router = createBrowserRouter([
	{
		path: '/',
		Component: MainLayout,
		children: [
			{
				index: true,
				Component: HomePage,
			},
			{
				path: 'about',
				Component: AboutPage,
			},
			{
				path: 'login',
				Component: LoginPage,
			},
			{
				path: '*',
				Component: NotFoundPage,
			},
		],
	},
	{
		path: '/admin',
		Component: () => (
			<ProtectedRoute>
				<AdminLayout />
			</ProtectedRoute>
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
						<AdminUsersPage />
					</LazyComponent>
				),
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
