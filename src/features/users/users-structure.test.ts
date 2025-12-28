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
describe('Users Feature Structure Property Tests', () => {
	it('should have consistent directory structure with required subdirectories and index.ts', () => {
		fc.assert(
			fc.property(
				fc.constant('users'), // We're testing the users feature specifically
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

	it('should export public API from index.ts', async () => {
		// Import the users feature module using relative path
		const usersModule = await import('./index.js')

		fc.assert(
			fc.property(fc.constant('users'), () => {
				// Verify that the module exports something (public API exists)
				expect(Object.keys(usersModule).length).toBeGreaterThan(0)

				// Verify specific exports for users feature
				expect(usersModule).toHaveProperty('UserList')
				expect(usersModule).toHaveProperty('UserCard')
				expect(usersModule).toHaveProperty('useUsersQuery')
				expect(usersModule).toHaveProperty('useCreateUser')
				expect(usersModule).toHaveProperty('useUpdateUser')
				expect(usersModule).toHaveProperty('useDeleteUser')
			}),
			{ numRuns: 100 },
		)
	})
})
