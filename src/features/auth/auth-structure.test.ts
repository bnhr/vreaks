import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { existsSync, statSync } from 'fs'
import { join } from 'path'

/**
 * Feature: project-restructure, Property 1: Feature Directory Structure Consistency
 * Validates: Requirements 1.2, 8.1
 *
 * Property: For any feature created in the `features/` directory,
 * the feature SHALL have subdirectories for `api/`, `components/`, `types/`,
 * and an `index.ts` file for public API exports.
 */
describe('Auth Feature Structure Property Tests', () => {
	it('should have consistent directory structure with required subdirectories and index.ts', () => {
		fc.assert(
			fc.property(
				fc.constant('auth'), // We're testing the auth feature specifically
				(featureName) => {
					const featurePath = join(
						process.cwd(),
						'src',
						'features',
						featureName,
					)

					// Feature directory must exist
					expect(existsSync(featurePath)).toBe(true)
					expect(statSync(featurePath).isDirectory()).toBe(true)

					// Required subdirectories must exist
					const requiredDirs = ['api', 'components', 'types']
					for (const dir of requiredDirs) {
						const dirPath = join(featurePath, dir)
						expect(existsSync(dirPath), `${dir}/ directory should exist`).toBe(
							true,
						)
						expect(
							statSync(dirPath).isDirectory(),
							`${dir}/ should be a directory`,
						).toBe(true)
					}

					// index.ts must exist for public API
					const indexPath = join(featurePath, 'index.ts')
					expect(existsSync(indexPath), 'index.ts should exist').toBe(true)
					expect(
						statSync(indexPath).isFile(),
						'index.ts should be a file',
					).toBe(true)
				},
			),
			{ numRuns: 100 },
		)
	})

	it('should have hooks directory for auth feature', () => {
		const featurePath = join(process.cwd(), 'src', 'features', 'auth')
		const hooksPath = join(featurePath, 'hooks')

		expect(existsSync(hooksPath)).toBe(true)
		expect(statSync(hooksPath).isDirectory()).toBe(true)
	})

	it('should export public API from index.ts', async () => {
		// Import the auth feature module using relative path
		const authModule = await import('./index.js')

		// Verify that the module exports something (public API exists)
		expect(Object.keys(authModule).length).toBeGreaterThan(0)

		// Verify specific exports for auth feature
		expect(authModule).toHaveProperty('LoginForm')
		expect(authModule).toHaveProperty('ProtectedRoute')
		expect(authModule).toHaveProperty('useLogin')
		expect(authModule).toHaveProperty('useMeQuery')
		expect(authModule).toHaveProperty('useAuth')
	})
})
