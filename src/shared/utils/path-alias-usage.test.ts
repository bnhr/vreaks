import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, relative, dirname, resolve } from 'path'

/**
 * Feature: project-restructure, Property 4: Path Alias Usage in Imports
 * Validates: Requirements 7.3
 *
 * Property: For any import statement in the restructured codebase, imports SHALL use
 * path aliases (~/features/, ~/shared/, ~/pages/, ~/widgets/, ~/app/) rather than
 * relative paths when importing across directory boundaries.
 */
describe('Path Alias Usage Property Tests', () => {
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

	// Helper function to check if import crosses directory boundaries
	function crossesDirectoryBoundary(
		importPath: string,
		fromFile: string,
	): boolean {
		// Skip external packages
		if (!importPath.startsWith('.') && !importPath.startsWith('~')) {
			return false
		}

		// Already uses path alias
		if (importPath.startsWith('~/')) {
			return false
		}

		// Resolve the import path
		const fromDir = dirname(fromFile)
		const resolvedImport = resolve(fromDir, importPath)
		const srcDir = join(process.cwd(), 'src')

		// Get the top-level directories
		const fromRelative = relative(srcDir, fromFile)
		const toRelative = relative(srcDir, resolvedImport)

		const fromTopLevel = fromRelative.split('/')[0]
		const toTopLevel = toRelative.split('/')[0]

		// Check if crossing top-level boundaries (app, features, pages, widgets, shared)
		const topLevelDirs = ['app', 'features', 'pages', 'widgets', 'shared']

		if (
			topLevelDirs.includes(fromTopLevel) &&
			topLevelDirs.includes(toTopLevel)
		) {
			return fromTopLevel !== toTopLevel
		}

		return false
	}

	it('should use path aliases for cross-boundary imports', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)

		fc.assert(
			fc.property(fc.constantFrom(...allFiles), (filePath) => {
				const imports = extractImportPaths(filePath)

				for (const { path: importPath, line } of imports) {
					const crossesBoundary = crossesDirectoryBoundary(importPath, filePath)

					if (crossesBoundary) {
						expect(
							crossesBoundary,
							`File "${relative(process.cwd(), filePath)}" line ${line} uses relative import "${importPath}" across directory boundaries. Should use path alias instead.`,
						).toBe(false)
					}
				}
			}),
			{ numRuns: 100 },
		)
	})

	it('should have all cross-boundary imports use path aliases', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)

		const violatingImports: Array<{
			file: string
			import: string
			line: number
		}> = []

		for (const filePath of allFiles) {
			const imports = extractImportPaths(filePath)

			for (const { path: importPath, line } of imports) {
				if (crossesDirectoryBoundary(importPath, filePath)) {
					violatingImports.push({
						file: relative(process.cwd(), filePath),
						import: importPath,
						line,
					})
				}
			}
		}

		expect(
			violatingImports,
			`Found ${violatingImports.length} relative imports crossing directory boundaries: ${JSON.stringify(violatingImports, null, 2)}`,
		).toHaveLength(0)
	})

	it('should verify path aliases are used for feature imports', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)

		// Filter to files outside features directory
		const nonFeatureFiles = allFiles.filter(
			(file) => !file.includes('/features/'),
		)

		const featureImportsWithoutAlias: Array<{
			file: string
			import: string
			line: number
		}> = []

		for (const filePath of nonFeatureFiles) {
			const imports = extractImportPaths(filePath)

			for (const { path: importPath, line } of imports) {
				// Check if it's a relative import that resolves to features directory
				if (importPath.startsWith('.')) {
					const fromDir = dirname(filePath)
					const resolvedImport = resolve(fromDir, importPath)

					if (resolvedImport.includes('/features/')) {
						featureImportsWithoutAlias.push({
							file: relative(process.cwd(), filePath),
							import: importPath,
							line,
						})
					}
				}
			}
		}

		expect(
			featureImportsWithoutAlias,
			`Found ${featureImportsWithoutAlias.length} relative imports to features without path alias: ${JSON.stringify(featureImportsWithoutAlias, null, 2)}`,
		).toHaveLength(0)
	})

	it('should verify path aliases are configured correctly', () => {
		const expectedAliases = [
			'~/app/*',
			'~/features/*',
			'~/pages/*',
			'~/widgets/*',
			'~/shared/*',
		]

		// Read tsconfig.app.json
		const tsconfigPath = join(process.cwd(), 'tsconfig.app.json')
		const tsconfigContent = readFileSync(tsconfigPath, 'utf-8')

		fc.assert(
			fc.property(fc.constantFrom(...expectedAliases), (alias) => {
				expect(
					tsconfigContent.includes(alias),
					`tsconfig.app.json should include path alias "${alias}"`,
				).toBe(true)
			}),
			{ numRuns: 100 },
		)
	})
})
