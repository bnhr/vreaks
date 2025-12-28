import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readdirSync, readFileSync, statSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * Feature: project-restructure, Property 8: Feature Public API Completeness
 * Validates: Requirements 8.2, 8.3, 8.4
 *
 * Property: For any feature in the `features/` directory, the feature's `index.ts`
 * file SHALL export components, hooks/queries, and types that are intended for use
 * by other features or pages.
 */
describe('Feature Public API Completeness Property Tests', () => {
	// Helper function to get all features
	function getAllFeatures(): string[] {
		const featuresDir = join(process.cwd(), 'src', 'features')

		if (!existsSync(featuresDir)) {
			return []
		}

		return readdirSync(featuresDir).filter((f) => {
			const stat = statSync(join(featuresDir, f))
			return stat.isDirectory()
		})
	}

	// Helper function to get all files in a directory
	function getAllFiles(dir: string, fileList: string[] = []): string[] {
		if (!existsSync(dir)) {
			return fileList
		}

		const files = readdirSync(dir)

		for (const file of files) {
			const filePath = join(dir, file)
			const stat = statSync(filePath)

			if (stat.isDirectory()) {
				getAllFiles(filePath, fileList)
			} else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
				fileList.push(filePath)
			}
		}

		return fileList
	}

	it('should have all features export a public API through index.ts', () => {
		const features = getAllFeatures()

		fc.assert(
			fc.property(fc.constantFrom(...features), (featureName) => {
				const featurePath = join(process.cwd(), 'src', 'features', featureName)
				const indexPath = join(featurePath, 'index.ts')

				expect(
					existsSync(indexPath),
					`Feature "${featureName}" should have an index.ts file`,
				).toBe(true)

				// Verify index.ts has exports
				const content = readFileSync(indexPath, 'utf-8')
				const hasExports = /export\s+/.test(content)

				expect(
					hasExports,
					`Feature "${featureName}" index.ts should have exports`,
				).toBe(true)
			}),
			{ numRuns: 100 },
		)
	})

	it('should verify features export components from their public API', () => {
		const features = getAllFeatures()

		for (const featureName of features) {
			const featurePath = join(process.cwd(), 'src', 'features', featureName)
			const componentsDir = join(featurePath, 'components')

			// If feature has components directory, verify they're exported
			if (existsSync(componentsDir)) {
				const componentFiles = getAllFiles(componentsDir).filter(
					(f) => !f.endsWith('.test.ts') && !f.endsWith('.test.tsx'),
				)

				if (componentFiles.length > 0) {
					const indexPath = join(featurePath, 'index.ts')
					const indexContent = readFileSync(indexPath, 'utf-8')

					// Check if index.ts has component exports
					const hasComponentExports =
						/export\s+.*from\s+['"]\.\/components/.test(indexContent) ||
						/export\s+{\s*\w+.*}\s+from\s+['"]\.\/components/.test(indexContent)

					expect(
						hasComponentExports,
						`Feature "${featureName}" has components but doesn't export them from index.ts`,
					).toBe(true)
				}
			}
		}
	})

	it('should verify features export hooks/queries from their public API', () => {
		const features = getAllFeatures()

		for (const featureName of features) {
			const featurePath = join(process.cwd(), 'src', 'features', featureName)
			const apiDir = join(featurePath, 'api')
			const hooksDir = join(featurePath, 'hooks')

			// If feature has api or hooks directory, verify they're exported
			const hasApi =
				existsSync(apiDir) &&
				getAllFiles(apiDir).filter(
					(f) => !f.endsWith('.test.ts') && !f.endsWith('.test.tsx'),
				).length > 0
			const hasHooks =
				existsSync(hooksDir) &&
				getAllFiles(hooksDir).filter(
					(f) => !f.endsWith('.test.ts') && !f.endsWith('.test.tsx'),
				).length > 0

			if (hasApi || hasHooks) {
				const indexPath = join(featurePath, 'index.ts')
				const indexContent = readFileSync(indexPath, 'utf-8')

				// Check if index.ts has api/hooks exports
				const hasApiExports =
					/export\s+.*from\s+['"]\.\/api/.test(indexContent) ||
					/export\s+{\s*\w+.*}\s+from\s+['"]\.\/api/.test(indexContent) ||
					/export\s+.*from\s+['"]\.\/hooks/.test(indexContent) ||
					/export\s+{\s*\w+.*}\s+from\s+['"]\.\/hooks/.test(indexContent)

				expect(
					hasApiExports,
					`Feature "${featureName}" has api/hooks but doesn't export them from index.ts`,
				).toBe(true)
			}
		}
	})

	it('should verify features export types from their public API', () => {
		const features = getAllFeatures()

		for (const featureName of features) {
			const featurePath = join(process.cwd(), 'src', 'features', featureName)
			const typesDir = join(featurePath, 'types')

			// If feature has types directory, verify they're exported
			if (existsSync(typesDir)) {
				const typeFiles = getAllFiles(typesDir).filter(
					(f) => !f.endsWith('.test.ts') && !f.endsWith('.test.tsx'),
				)

				if (typeFiles.length > 0) {
					const indexPath = join(featurePath, 'index.ts')
					const indexContent = readFileSync(indexPath, 'utf-8')

					// Check if index.ts has type exports
					const hasTypeExports =
						/export\s+(?:type|interface)/.test(indexContent) ||
						/export\s+.*from\s+['"]\.\/types/.test(indexContent) ||
						/export\s+{\s*(?:type\s+)?\w+.*}\s+from\s+['"]\.\/types/.test(
							indexContent,
						)

					expect(
						hasTypeExports,
						`Feature "${featureName}" has types but doesn't export them from index.ts`,
					).toBe(true)
				}
			}
		}
	})

	it('should verify feature public APIs do not export internal implementation details', () => {
		const features = getAllFeatures()

		fc.assert(
			fc.property(fc.constantFrom(...features), (featureName) => {
				const featurePath = join(process.cwd(), 'src', 'features', featureName)
				const indexPath = join(featurePath, 'index.ts')
				const indexContent = readFileSync(indexPath, 'utf-8')

				// Check for exports that might be internal implementation details
				const hasInternalExports =
					/export\s+.*from\s+['"]\.\/utils\/internal/.test(indexContent) ||
					/export\s+.*from\s+['"]\.\/lib\/private/.test(indexContent) ||
					/export\s+.*_internal/i.test(indexContent) ||
					/export\s+.*_private/i.test(indexContent)

				expect(
					hasInternalExports,
					`Feature "${featureName}" should not export internal implementation details from index.ts`,
				).toBe(false)
			}),
			{ numRuns: 100 },
		)
	})

	it('should verify feature index.ts files are not empty', () => {
		const features = getAllFeatures()

		fc.assert(
			fc.property(fc.constantFrom(...features), (featureName) => {
				const featurePath = join(process.cwd(), 'src', 'features', featureName)
				const indexPath = join(featurePath, 'index.ts')
				const indexContent = readFileSync(indexPath, 'utf-8')

				// Remove comments and whitespace
				const contentWithoutComments = indexContent
					.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
					.trim()

				expect(
					contentWithoutComments.length,
					`Feature "${featureName}" index.ts should not be empty`,
				).toBeGreaterThan(0)
			}),
			{ numRuns: 100 },
		)
	})

	it('should verify features have consistent export patterns', () => {
		const features = getAllFeatures()

		for (const featureName of features) {
			const featurePath = join(process.cwd(), 'src', 'features', featureName)
			const indexPath = join(featurePath, 'index.ts')
			const indexContent = readFileSync(indexPath, 'utf-8')

			// Check for re-export pattern (export { X } from './path')
			const hasReExports = /export\s+{\s*[^}]+\s*}\s+from/.test(indexContent)

			// Check for direct exports (export const X = ...)
			const hasDirectExports =
				/export\s+(?:const|let|var|function|class|interface|type|enum)\s+\w+/.test(
					indexContent,
				)

			// Feature should use at least one export pattern
			expect(
				hasReExports || hasDirectExports,
				`Feature "${featureName}" index.ts should use consistent export patterns`,
			).toBe(true)
		}
	})
})
