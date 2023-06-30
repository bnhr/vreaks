import { createBrowserRouter } from 'react-router-dom'

import AboutPage from '~/pages/About'
import HomePage from '~/pages/Home'

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: 'about',
		element: <AboutPage />,
	},
])

export default router
