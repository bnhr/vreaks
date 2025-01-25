import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: [{ find: '~', replacement: path.resolve(__dirname, 'src') }],
	},
})
