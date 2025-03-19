import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import Root from './routes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Root />
	</React.StrictMode>,
)
