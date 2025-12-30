import path from 'path'
import os from 'os'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

// Detect CI environment
const isCI = process.env.CI === 'true' || 
             process.env.GITHUB_ACTIONS === 'true' || 
             process.env.GITLAB_CI === 'true' ||
             process.env.CIRCLECI === 'true' ||
             process.env.TRAVIS === 'true'

export default defineConfig({
	resolve: {
		alias: [
			{ find: '~', replacement: path.resolve(__dirname, 'src') },
			{ find: '~/test', replacement: path.resolve(__dirname, 'src/test') },
		],
	},
	test: {
		globals: true,
		// Use jsdom for component tests (will migrate to browser mode later)
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
		// Exclude E2E tests (they run with Playwright)
		exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/.{idea,git,cache,output,temp}/**'],
		// Browser mode configuration (disabled for now, will be enabled in task 6)
		browser: {
			enabled: false,
			provider: playwright(),
			instances: [
				{ browser: 'chromium' },
			],
			headless: isCI,
			screenshotFailures: true,
		},
		// Parallel execution configuration
		pool: 'threads',
		poolOptions: {
			threads: {
				// Use all available CPUs in CI, or half in local dev
				maxThreads: isCI ? undefined : Math.max(1, Math.floor(os.cpus().length / 2)),
				minThreads: 1,
			},
		},
		// Coverage configuration
		coverage: {
			enabled: false, // Enable with --coverage flag
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/**/*.test.{ts,tsx}',
				'src/**/*.spec.{ts,tsx}',
				'src/test/**',
				'src/mock/**',
				'src/vite-env.d.ts',
				'src/main.tsx',
			],
			all: true,
			lines: 80,
			functions: 80,
			branches: 80,
			statements: 80,
			// Don't fail on coverage thresholds in CI (just report)
			thresholdAutoUpdate: false,
			allowExternal: false,
		},
	},
})
