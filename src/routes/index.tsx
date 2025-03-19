import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'

import { LazyComponent } from '~/components/layouts/lazy-comp'
import { ProtectedPage } from '~/domain/auth/protected'
import { AdminLayout } from '~/components/layouts/admin/admin-layout'
import { queryClient } from '~/constant'

const AboutPage = lazy(() => import('~/domain/about/about'))
const HomePage = lazy(() => import('~/domain/home/home'))
const NotFoundPage = lazy(() => import('~/domain/errors/not-found'))
const LoginPage = lazy(() => import('~/domain/auth/login'))
const AdminPage = lazy(() => import('~/domain/dashboard/admin'))
const UsersPage = lazy(() => import('~/domain/dashboard/user'))

function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					index
					element={
						<LazyComponent>
							<HomePage />
						</LazyComponent>
					}
				/>
				<Route
					path="about"
					element={<AboutPage />}
				/>
				<Route
					path="login"
					element={<LoginPage />}
				/>
				<Route
					path="admin"
					element={
						<ProtectedPage>
							<AdminLayout />
						</ProtectedPage>
					}
				>
					<Route
						index
						element={
							<LazyComponent>
								<AdminPage />
							</LazyComponent>
						}
					/>
					<Route
						path="users"
						element={
							<LazyComponent>
								<UsersPage />
							</LazyComponent>
						}
					/>
				</Route>
				<Route
					path="*"
					element={<NotFoundPage />}
				/>
			</Routes>
		</BrowserRouter>
	)
}

function Root() {
	return (
		<QueryClientProvider client={queryClient}>
			{import.meta.env.VITE_MODE !== 'production' ? (
				<ReactQueryDevtools initialIsOpen={false} />
			) : null}
			<Router />
		</QueryClientProvider>
	)
}

export default Root
