/**
 * Test utilities module
 * Central export point for all test utilities, factories, and helpers
 */

// Setup and configuration
export { setupTestEnvironment } from './setup'

// Test data factories
export {
	type TestDataFactory,
	type TestUser,
	type TestAuthState,
	type TestApiResponse,
	userFactory,
	authFactory,
	createApiResponseFactory,
	resetFactories,
} from './factories'

// Disposable resources
export {
	type AsyncDisposable,
	type TestServerConfig,
	type TestServer,
	type TestDatabaseConfig,
	type TestDatabase,
	createDisposable,
	createTestServer,
	createTestDatabase,
	cleanupAll,
} from './disposables'

// Component render utilities
export {
	type RenderWithProvidersOptions,
	type RenderWithProvidersResult,
	createTestQueryClient,
	renderWithProviders,
} from './render-utils'

// State management utilities
export {
	type MockApiResponseOptions,
	mockApiResponse,
	waitForQuery,
	renderHookWithStore,
	registerStore,
	resetAllStores,
	clearStoreRegistry,
} from './state-utils'
