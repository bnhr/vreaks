import React from 'react'
import ReactDOM from 'react-dom/client'

import '~/app/styles/index.css'
import Root from '~/app/routes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Root />
	</React.StrictMode>,
)
