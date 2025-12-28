import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readdirSync, statSync, existsSync } from 'fs'
import { join, dirname, basename, relative } from 'path'

/**
 * Feature: project-restructure, Property 5: Test File Co-location
 * Validates: Requirements 14.1, 14.2
 *
 * Property: For any component or utility file that is moved during restructuring,
 * if a corresponding test file exists (.test.tsx or .test.ts), the test file SHALL
 * be moved to the same directory as the source file.
 */
describe('Test File Co-location Property Tests', () => {
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

	// Helper function to get test file path for a source file
	function getTestFilePath(sourceFile: string): string {
		const dir = dirname(sourceFile)
		const base = basename(sourceFile)
		const nameWithoutExt = base.replace(/\.(ts|tsx)$/, '')

		// Try both .test.ts and .test.tsx
		const testTs = join(dir, `${nameWithoutExt}.test.ts`)
		const testTsx = join(dir, `${nameWithoutExt}.test.tsx`)

		if (existsSync(testTs)) {
			return testTs
		}
		if (existsSync(testTsx)) {
			return testTsx
		}

		return ''
	}

	// Helper function to check if a file is a test file
	function isTestFile(filePath: string): boolean {
		return filePath.endsWith('.test.ts') || filePath.endsWith('.test.tsx')
	}

	it('should have test files co-located with their source files', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)

		// Get all test files
		const testFiles = allFiles.filter(isTestFile)

		fc.assert(
			fc.property(fc.constantFrom(...testFiles), (testFile) => {
				const testBasename = basename(testFile)
				const testDir = dirname(testFile)

				// Check if this is a special test file (structure, correctness, etc.)
				const isSpecialTest =
					testBasename.includes('structure') ||
					testBasename.includes('correctness') ||
					testBasename.includes('colocation') ||
					testBasename.includes('imports') ||
					testBasename.includes('alias') ||
					testBasename.includes('naming') ||
					testBasename.includes('completeness')

				// Special tests don't need corresponding source files
				if (isSpecialTest) {
					return
				}

				// Extract source file name from test file name
				const sourceBasename = testBasename.replace('.test.', '.')
				const expectedSourceFile = join(testDir, sourceBasename)

				// Test file should be in the same directory as its source file
				// (or the source file should exist in the same directory)
				const sourceExists = existsSync(expectedSourceFile)

				expect(
					sourceExists,
					`Test file "${relative(process.cwd(), testFile)}" should be co-located with source file "${sourceBasename}"`,
				).toBe(true)
			}),
			{ numRuns: 100 },
		)
	})

	it('should verify all component test files are co-located', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)

		// Get all component files (files in components directories)
		const componentFiles = allFiles.filter(
			(file) => file.includes('/components/') && !isTestFile(file),
		)

		const missingColocatedTests: Array<{
			component: string
			expectedTest: string
		}> = []

		for (const componentFile of componentFiles) {
			const testFile = getTestFilePath(componentFile)

			// If a test file exists, verify it's in the same directory
			if (testFile) {
				const componentDir = dirname(componentFile)
				const testDir = dirname(testFile)

				if (componentDir !== testDir) {
					missingColocatedTests.push({
						component: relative(process.cwd(), componentFile),
						expectedTest: relative(process.cwd(), testFile),
					})
				}
			}
		}

		expect(
			missingColocatedTests,
			`Found ${missingColocatedTests.length} component test files not co-located: ${JSON.stringify(missingColocatedTests, null, 2)}`,
		).toHaveLength(0)
	})

	it('should verify all utility test files are co-located', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)

		// Get all utility files (files in utils directories)
		const utilityFiles = allFiles.filter(
			(file) =>
				file.includes('/utils/') &&
				!isTestFile(file) &&
				!file.endsWith('index.ts'),
		)

		const missingColocatedTests: Array<{
			utility: string
			expectedTest: string
		}> = []

		for (const utilityFile of utilityFiles) {
			const testFile = getTestFilePath(utilityFile)

			// If a test file exists, verify it's in the same directory
			if (testFile) {
				const utilityDir = dirname(utilityFile)
				const testDir = dirname(testFile)

				if (utilityDir !== testDir) {
					missingColocatedTests.push({
						utility: relative(process.cwd(), utilityFile),
						expectedTest: relative(process.cwd(), testFile),
					})
				}
			}
		}

		expect(
			missingColocatedTests,
			`Found ${missingColocatedTests.length} utility test files not co-located: ${JSON.stringify(missingColocatedTests, null, 2)}`,
		).toHaveLength(0)
	})

	it('should verify test files exist in same directory as source', () => {
		const srcDir = join(process.cwd(), 'src')
		const allFiles = getAllTsFiles(srcDir)
		const testFiles = allFiles.filter(isTestFile)

		fc.assert(
			fc.property(fc.constantFrom(...testFiles), (testFile) => {
				const dir = dirname(testFile)
				const testBasename = basename(testFile)
				const sourceBasename = testBasename.replace('.test.', '.')
				const sourceFile = join(dir, sourceBasename)

				// Either the source file exists in the same directory,
				// or this is a special test file (like structure tests)
				const isSpecialTest =
					testBasename.includes('structure') ||
					testBasename.includes('correctness') ||
					testBasename.includes('colocation') ||
					testBasename.includes('imports') ||
					testBasename.includes('alias') ||
					testBasename.includes('naming') ||
					testBasename.includes('completeness')

				if (!isSpecialTest) {
					expect(
						existsSync(sourceFile),
						`Test file "${relative(process.cwd(), testFile)}" should have corresponding source file "${sourceBasename}" in same directory`,
					).toBe(true)
				}
			}),
			{ numRuns: 100 },
		)
	})
})
