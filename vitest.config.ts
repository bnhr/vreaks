import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: [{ find: '~', replacement: path.resolve(__dirname, 'src') }],
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: "./src/test/setup.ts"
	},
})
