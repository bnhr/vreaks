import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, relative } from 'path'

/**
 * Feature: project-restructure, Property 3: Feature Public API Import Pattern
 * Validates: Requirements 7.2
 *
 * Property: For any feature with a public API (index.ts), imports from other features
 * or pages SHALL use the feature's index exports rather than deep imports into the
 * feature's internal structure.
 */
describe('Feature Public API Import Pattern Property Tests', () => {
	// Helper function to recursively get all TypeScript files
	function getAllTsFiles(dir: string, fileList: string[] = []): string[] {
		const files = readdirSync(dir)

		for (const file of files) {
			const filePath = join(dir, file)
			const stat = statSync(filePath)

			if (stat.isDirectory()) {
				if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
					getAllTsFiles(filePath, fileList)
				}
			} else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
				fileList.push(filePath)
			}
		}

		return fileList
	}

	// Helper function to extract import paths from a file
	function extractImportPaths(
		filePath: string,
	): Array<{ path: string; line: number }> {
		const content = readFileSync(filePath, 'utf-8')
		const lines = content.split('\n')
		const imports: Array<{ path: string; line: number }> = []

		lines.forEach((line, index) => {
			const importRegex =
				/import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/
			const match = importRegex.exec(line)

			if (match) {
				imports.push({ path: match[1], line: index + 1 })
			}
		})

		return imports
	}

	// Helper function to check if a file is inside a feature directory
	function getFeatureFromPath(filePath: string): string | null {
		const srcDir = join(process.cwd(), 'src')
		const relativePath = relative(srcDir, filePath)
		const parts = relativePath.split('/')

		if (parts[0] === 'features' && parts.length > 1) {
			return parts[1]
		}

		return null
	}

	// Helper function to check if import is a deep import into a feature
	function isDeepFeatureImport(importPath: string): {
		isDeep: boolean
		feature: string | null
	} {
		// Check for path alias imports to features
		const featureAliasRegex = /^~\/features\/([^/]+)\/(.+)/
		const match = featureAliasRegex.exec(importPath)

		if (match) {
			const feature = match[1]
			const subPath = match[2]

			// If it's not just the feature name or index, it's a deep import
			if (subPath && subPath !== 'index' && subPath !== 'index.ts') {
				return { isDeep: true, feature }
			}
		}

		return { isDeep: false, feature: null }
	}

	it('should use feature public API imports instead of deep imports', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)

		// Filter to files outside of features (pages, widgets, app) and files in different features
		const filesToCheck = allFiles.filter((file) => {
			const feature = getFeatureFromPath(file)
			// Check pages, widgets, app, and other features
			return (
				feature === null ||
				file.includes('/pages/') ||
				file.includes('/widgets/') ||
				file.includes('/app/')
			)
		})

		fc.assert(
			fc.property(fc.constantFrom(...filesToCheck), (filePath) => {
				const imports = extractImportPaths(filePath)
				const currentFeature = getFeatureFromPath(filePath)

				for (const { path: importPath, line } of imports) {
					const { isDeep, feature } = isDeepFeatureImport(importPath)

					// If it's a deep import into a different feature, it should use public API
					if (isDeep && feature !== currentFeature) {
						expect(
							isDeep,
							`File "${relative(process.cwd(), filePath)}" line ${line} has deep import "${importPath}" into feature "${feature}". Should use "~/features/${feature}" instead.`,
						).toBe(false)
					}
				}
			}),
			{ numRuns: 100 },
		)
	})

	it('should not have any deep imports from pages to features', () => {
		const srcDir = join(process.cwd(), 'src')
		const pagesDir = join(srcDir, 'pages')
		const pageFiles = getAllTsFiles(pagesDir)

		const deepImports: Array<{ file: string; import: string; line: number }> =
			[]

		for (const filePath of pageFiles) {
			const imports = extractImportPaths(filePath)

			for (const { path: importPath, line } of imports) {
				const { isDeep } = isDeepFeatureImport(importPath)

				if (isDeep) {
					deepImports.push({
						file: relative(process.cwd(), filePath),
						import: importPath,
						line,
					})
				}
			}
		}

		expect(
			deepImports,
			`Found ${deepImports.length} deep imports from pages to features: ${JSON.stringify(deepImports, null, 2)}`,
		).toHaveLength(0)
	})

	it('should verify features export public APIs through index.ts', () => {
		const featuresDir = join(process.cwd(), 'src', 'features')
		const features = readdirSync(featuresDir).filter((f) => {
			const stat = statSync(join(featuresDir, f))
			return stat.isDirectory()
		})

		fc.assert(
			fc.property(fc.constantFrom(...features), (featureName) => {
				const indexPath = join(featuresDir, featureName, 'index.ts')
				const stat = statSync(indexPath)

				expect(
					stat.isFile(),
					`Feature "${featureName}" should have index.ts`,
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
})
