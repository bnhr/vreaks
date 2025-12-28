import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readdirSync, readFileSync, statSync, existsSync } from 'fs'
import { join, relative, dirname } from 'path'

/**
 * Feature: project-restructure, Property 2: Import Path Correctness After File Movement
 * Validates: Requirements 7.1
 *
 * Property: For any file that is moved during restructuring, all import statements
 * in other files that reference the moved file SHALL be updated to use the new file path.
 */
describe('Import Path Correctness Property Tests', () => {
	// Helper function to recursively get all TypeScript files
	function getAllTsFiles(dir: string, fileList: string[] = []): string[] {
		const files = readdirSync(dir)

		for (const file of files) {
			const filePath = join(dir, file)
			const stat = statSync(filePath)

			if (stat.isDirectory()) {
				// Skip node_modules and dist directories
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
	function extractImportPaths(filePath: string): string[] {
		const content = readFileSync(filePath, 'utf-8')
		const importRegex =
			/import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g
		const imports: string[] = []
		let match

		while ((match = importRegex.exec(content)) !== null) {
			imports.push(match[1])
		}

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

	it('should have all import paths resolve to existing files', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)

		fc.assert(
			fc.property(fc.constantFrom(...allFiles), (filePath) => {
				const imports = extractImportPaths(filePath)

				for (const importPath of imports) {
					const resolved = resolveImportPath(importPath, filePath)

					// Skip external packages
					if (resolved === 'external') {
						continue
					}

					expect(
						resolved,
						`Import "${importPath}" in file "${relative(process.cwd(), filePath)}" should resolve to an existing file`,
					).not.toBeNull()
				}
			}),
			{ numRuns: 100 },
		)
	})

	it('should not have any broken relative imports after restructuring', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)

		const brokenImports: Array<{ file: string; import: string }> = []

		for (const filePath of allFiles) {
			const imports = extractImportPaths(filePath)

			for (const importPath of imports) {
				// Only check relative imports
				if (importPath.startsWith('.')) {
					const resolved = resolveImportPath(importPath, filePath)

					if (resolved === null) {
						brokenImports.push({
							file: relative(process.cwd(), filePath),
							import: importPath,
						})
					}
				}
			}
		}

		expect(
			brokenImports,
			`Found ${brokenImports.length} broken relative imports: ${JSON.stringify(brokenImports, null, 2)}`,
		).toHaveLength(0)
	})
})
