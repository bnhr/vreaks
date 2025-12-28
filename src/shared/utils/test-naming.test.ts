import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readdirSync, statSync } from 'fs'
import { join, basename, relative } from 'path'

/**
 * Feature: project-restructure, Property 6: Test File Naming Convention
 * Validates: Requirements 14.3
 *
 * Property: For any test file in the restructured codebase, the file name SHALL
 * follow the .test.tsx or .test.ts naming convention.
 */
describe('Test File Naming Convention Property Tests', () => {
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
		const name = basename(filePath)
		return name.includes('.test.') || name.includes('.spec.')
	}

	// Helper function to check if test file follows naming convention
	function followsNamingConvention(filePath: string): boolean {
		const name = basename(filePath)
		return name.endsWith('.test.ts') || name.endsWith('.test.tsx')
	}

	it('should have all test files follow .test.ts or .test.tsx naming convention', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)
		const testFiles = allFiles.filter(isTestFile)

		fc.assert(
			fc.property(fc.constantFrom(...testFiles), (testFile) => {
				const followsConvention = followsNamingConvention(testFile)

				expect(
					followsConvention,
					`Test file "${relative(process.cwd(), testFile)}" should follow .test.ts or .test.tsx naming convention`,
				).toBe(true)
			}),
			{ numRuns: 100 },
		)
	})

	it('should not have any .spec.ts or .spec.tsx files', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)

		const specFiles = allFiles.filter((file) => {
			const name = basename(file)
			return name.endsWith('.spec.ts') || name.endsWith('.spec.tsx')
		})

		expect(
			specFiles,
			`Found ${specFiles.length} files using .spec naming convention instead of .test: ${JSON.stringify(
				specFiles.map((f) => relative(process.cwd(), f)),
				null,
				2,
			)}`,
		).toHaveLength(0)
	})

	it('should verify test files have correct extension', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)
		const testFiles = allFiles.filter(isTestFile)

		const invalidExtensions: Array<{ file: string; extension: string }> = []

		for (const testFile of testFiles) {
			const name = basename(testFile)

			// Check if it has .test. but wrong extension
			if (
				name.includes('.test.') &&
				!name.endsWith('.test.ts') &&
				!name.endsWith('.test.tsx')
			) {
				const parts = name.split('.')
				const extension = parts[parts.length - 1]
				invalidExtensions.push({
					file: relative(process.cwd(), testFile),
					extension,
				})
			}
		}

		expect(
			invalidExtensions,
			`Found ${invalidExtensions.length} test files with invalid extensions: ${JSON.stringify(invalidExtensions, null, 2)}`,
		).toHaveLength(0)
	})

	it('should verify test files match source file type', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)
		const testFiles = allFiles.filter(isTestFile)

		fc.assert(
			fc.property(fc.constantFrom(...testFiles), (testFile) => {
				const name = basename(testFile)

				// If test file is .test.tsx, it should be testing a .tsx file (or be a component test)
				// If test file is .test.ts, it should be testing a .ts file
				const isTsx = name.endsWith('.test.tsx')
				const isTs = name.endsWith('.test.ts')

				// Both are valid conventions
				expect(
					isTsx || isTs,
					`Test file "${relative(process.cwd(), testFile)}" should end with .test.ts or .test.tsx`,
				).toBe(true)
			}),
			{ numRuns: 100 },
		)
	})

	it('should verify all test files are in src directory', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)
		const testFiles = allFiles.filter(isTestFile)

		fc.assert(
			fc.property(fc.constantFrom(...testFiles), (testFile) => {
				const isInSrc = testFile.startsWith(srcDir)

				expect(
					isInSrc,
					`Test file "${relative(process.cwd(), testFile)}" should be in src directory`,
				).toBe(true)
			}),
			{ numRuns: 100 },
		)
	})

	it('should verify test file naming pattern consistency', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)
		const testFiles = allFiles.filter(isTestFile)

		// All test files should follow the pattern: <name>.test.<ext>
		const invalidPatterns: Array<{ file: string; reason: string }> = []

		for (const testFile of testFiles) {
			const name = basename(testFile)

			// Check for multiple .test. in the name
			const testCount = (name.match(/\.test\./g) || []).length
			if (testCount > 1) {
				invalidPatterns.push({
					file: relative(process.cwd(), testFile),
					reason: 'Multiple .test. in filename',
				})
			}

			// Check for .test at the end without extension
			if (name.endsWith('.test')) {
				invalidPatterns.push({
					file: relative(process.cwd(), testFile),
					reason: 'Missing file extension after .test',
				})
			}
		}

		expect(
			invalidPatterns,
			`Found ${invalidPatterns.length} test files with invalid naming patterns: ${JSON.stringify(invalidPatterns, null, 2)}`,
		).toHaveLength(0)
	})
})
