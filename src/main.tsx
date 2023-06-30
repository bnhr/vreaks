import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App'

// eslint-disable-next-line import/no-named-as-default-member
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
