# Auth Feature

Authentication and authorization feature providing login, registration, and user session management.

## Public API

### Components

- `LoginForm` - Form component for user authentication
- `ProtectedRoute` - Route wrapper that requires authentication

### Hooks

- `useLogin()` - Mutation hook for user login
- `useMeQuery()` - Query hook for fetching current user data
- `useAuth()` - Convenience hook that provides authentication state

### Types

- `User` - User entity type
- `LoginData` - Login request payload
- `LoginResponse` - Login API response
- `RegisterData` - Registration request payload
- `RegisterResponse` - Registration API response
- `MeResponse` - Current user API response
- `RefreshData` - Token refresh request payload
- `RefreshResponse` - Token refresh API response
- `SuccessResponse` - Generic success response

## Usage Examples

### Protecting Routes

```tsx
import { ProtectedRoute } from '~/features/auth'

function App() {
	return (
		<ProtectedRoute>
			<Dashboard />
		</ProtectedRoute>
	)
}
```

### Login Form

```tsx
import { LoginForm } from '~/features/auth'

function LoginPage() {
	return <LoginForm />
}
```

### Using Authentication State

```tsx
import { useAuth } from '~/features/auth'

function Header() {
	const { user, isAuthenticated, isLoading } = useAuth()

	if (isLoading) return <div>Loading...</div>

	return (
		<div>
			{isAuthenticated ? (
				<span>Welcome, {user?.first_name}</span>
			) : (
				<a href="/login">Login</a>
			)}
		</div>
	)
}
```

## Dependencies

- **React Query** - Server state management for auth API calls
- **React Router** - Navigation and route protection
- **Users Feature** - Uses `User` type from users feature

## Architecture

- `api/` - React Query hooks for auth endpoints
- `components/` - Auth-related UI components
- `hooks/` - Custom hooks for auth logic
- `types/` - TypeScript type definitions
