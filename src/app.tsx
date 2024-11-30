import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './constant'
import { LazyComponent } from './layouts/lazy-comp'
import { AdminLayout } from './layouts/admin/admin-layout'
import { ProtectedPage } from './pages/auth/protected'

const AboutPage = lazy(() => import('~/pages/front/about'))
const HomePage = lazy(() => import('~/pages/front/home'))
const NotFoundPage = lazy(() => import('~/pages/errors/not-found'))
const LoginPage = lazy(() => import('~/pages/auth/login'))
const AdminPage = lazy(() => import('~/pages/dashboard/admin'))
const UsersPage = lazy(() => import('~/pages/dashboard/users'))

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
				<Route path="about" element={<AboutPage />} />
				<Route path="login" element={<LoginPage />} />
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
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	)
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<Router />
		</QueryClientProvider>
	)
}

export default App
