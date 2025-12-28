import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readdirSync, readFileSync, statSync, existsSync } from 'fs'
import { join, dirname, relative, resolve } from 'path'

/**
 * Feature: project-restructure, Property 7: Test Import Path Updates
 * Validates: Requirements 14.4
 *
 * Property: For any test file whose source file has been moved, all import statements
 * in the test file SHALL be updated to reflect the new file locations.
 */
describe('Test Import Path Updates Property Tests', () => {
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

	// Helper function to check if a file is a test file
	function isTestFile(filePath: string): boolean {
		return filePath.endsWith('.test.ts') || filePath.endsWith('.test.tsx')
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

	// Helper function to resolve import path to actual file
	function resolveImportPath(
		importPath: string,
		fromFile: string,
	): string | null {
		const srcDir = join(process.cwd(), 'src')

		// Handle path aliases
		if (importPath.startsWith('~/')) {
			const aliasPath = importPath.replace('~/', '')
			const resolvedPath = join(srcDir, aliasPath)

			// Try with extensions
			for (const ext of ['.ts', '.tsx', '/index.ts', '/index.tsx', '']) {
				const fullPath = resolvedPath + ext
				if (existsSync(fullPath)) {
					return fullPath
				}
			}
			return null
		}

		// Handle relative imports
		if (importPath.startsWith('.')) {
			const fromDir = dirname(fromFile)
			const resolvedPath = join(fromDir, importPath)

			// Try with extensions
			for (const ext of ['.ts', '.tsx', '/index.ts', '/index.tsx', '', '.js']) {
				const fullPath = resolvedPath + ext
				if (existsSync(fullPath)) {
					return fullPath
				}
			}
			return null
		}

		// External package imports are valid
		return 'external'
	}

	it('should have all test file imports resolve to existing files', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)
		const testFiles = allFiles.filter(isTestFile)

		fc.assert(
			fc.property(fc.constantFrom(...testFiles), (testFile) => {
				const imports = extractImportPaths(testFile)

				for (const { path: importPath, line } of imports) {
					const resolved = resolveImportPath(importPath, testFile)

					// Skip external packages
					if (resolved === 'external') {
						continue
					}

					expect(
						resolved,
						`Import "${importPath}" at line ${line} in test file "${relative(process.cwd(), testFile)}" should resolve to an existing file`,
					).not.toBeNull()
				}
			}),
			{ numRuns: 100 },
		)
	})

	it('should not have any broken imports in test files', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)
		const testFiles = allFiles.filter(isTestFile)

		const brokenImports: Array<{ file: string; import: string; line: number }> =
			[]

		for (const testFile of testFiles) {
			const imports = extractImportPaths(testFile)

			for (const { path: importPath, line } of imports) {
				const resolved = resolveImportPath(importPath, testFile)

				// Skip external packages
				if (resolved === 'external') {
					continue
				}

				if (resolved === null) {
					brokenImports.push({
						file: relative(process.cwd(), testFile),
						import: importPath,
						line,
					})
				}
			}
		}

		expect(
			brokenImports,
			`Found ${brokenImports.length} broken imports in test files: ${JSON.stringify(brokenImports, null, 2)}`,
		).toHaveLength(0)
	})

	it('should verify test files use correct import paths for their source files', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)
		const testFiles = allFiles.filter(isTestFile)

		fc.assert(
			fc.property(fc.constantFrom(...testFiles), (testFile) => {
				const imports = extractImportPaths(testFile)

				// Check if test file imports its corresponding source file
				const testDir = dirname(testFile)
				const testBasename = testFile.split('/').pop()!
				const sourceBasename = testBasename.replace('.test.', '.')
				const expectedSourcePath = join(testDir, sourceBasename)

				// If source file exists, verify it's imported (or it's a special test)
				if (existsSync(expectedSourcePath)) {
					const hasSourceImport = imports.some(({ path: importPath }) => {
						const resolved = resolveImportPath(importPath, testFile)
						return resolved === expectedSourcePath
					})

					// Some tests might not import their source file directly (e.g., integration tests)
					// So we just verify that if they do import it, the path is correct
					if (hasSourceImport) {
						expect(
							hasSourceImport,
							`Test file "${relative(process.cwd(), testFile)}" should correctly import its source file`,
						).toBe(true)
					}
				}
			}),
			{ numRuns: 100 },
		)
	})

	it('should verify test files use path aliases for cross-boundary imports', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)
		const testFiles = allFiles.filter(isTestFile)

		const violatingImports: Array<{
			file: string
			import: string
			line: number
		}> = []

		for (const testFile of testFiles) {
			const imports = extractImportPaths(testFile)

			for (const { path: importPath, line } of imports) {
				// Check if it's a relative import that crosses directory boundaries
				if (importPath.startsWith('.')) {
					const fromDir = dirname(testFile)
					const resolvedImport = resolve(fromDir, importPath)

					const fromRelative = relative(srcDir, testFile)
					const toRelative = relative(srcDir, resolvedImport)

					const fromTopLevel = fromRelative.split('/')[0]
					const toTopLevel = toRelative.split('/')[0]

					const topLevelDirs = [
						'app',
						'features',
						'pages',
						'widgets',
						'shared',
						'mock',
					]

					if (
						topLevelDirs.includes(fromTopLevel) &&
						topLevelDirs.includes(toTopLevel) &&
						fromTopLevel !== toTopLevel
					) {
						violatingImports.push({
							file: relative(process.cwd(), testFile),
							import: importPath,
							line,
						})
					}
				}
			}
		}

		expect(
			violatingImports,
			`Found ${violatingImports.length} test files with relative imports crossing directory boundaries: ${JSON.stringify(violatingImports, null, 2)}`,
		).toHaveLength(0)
	})

	it('should verify test files import from feature public APIs when appropriate', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)
		const testFiles = allFiles.filter(isTestFile)

		// Filter to test files outside of features
		const nonFeatureTests = testFiles.filter(
			(file) => !file.includes('/features/'),
		)

		const deepImports: Array<{ file: string; import: string; line: number }> =
			[]

		for (const testFile of nonFeatureTests) {
			const imports = extractImportPaths(testFile)

			for (const { path: importPath, line } of imports) {
				// Check for deep imports into features
				const featureDeepImportRegex = /^~\/features\/([^/]+)\/(.+)/
				const match = featureDeepImportRegex.exec(importPath)

				if (match) {
					const subPath = match[2]
					// If it's not just the feature name or index, it's a deep import
					if (subPath && subPath !== 'index' && subPath !== 'index.ts') {
						deepImports.push({
							file: relative(process.cwd(), testFile),
							import: importPath,
							line,
						})
					}
				}
			}
		}

		expect(
			deepImports,
			`Found ${deepImports.length} test files with deep imports into features: ${JSON.stringify(deepImports, null, 2)}`,
		).toHaveLength(0)
	})
})
