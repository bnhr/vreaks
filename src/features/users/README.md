# Users Feature

User management feature providing CRUD operations for user entities.

## Public API

### Components

- `UserList` - List view of all users
- `UserCard` - Card component displaying user information

### Hooks

- `useUsersQuery()` - Query hook for fetching users list
- `useCreateUser()` - Mutation hook for creating new users
- `useUpdateUser()` - Mutation hook for updating existing users
- `useDeleteUser()` - Mutation hook for deleting users

### Types

- `User` - User entity type
- `UserListResponse` - Users list API response
- `UserResponse` - Single user API response
- `UserPayload` - User creation request payload
- `UserUpdatePayload` - User update request payload
- `UserEdit` - User edit form data
- `Users` - Array of users

## Usage Examples

### Displaying Users List

```tsx
import { UserList } from '~/features/users'

function UsersPage() {
	return <UserList />
}
```

### Creating a User

```tsx
import { useCreateUser } from '~/features/users'

function CreateUserForm() {
	const createUser = useCreateUser()

	const handleSubmit = (data) => {
		createUser.mutate({
			email: data.email,
			username: data.username,
			first_name: data.firstName,
			last_name: data.lastName,
			role: 'user',
		})
	}

	return <form onSubmit={handleSubmit}>...</form>
}
```

### Updating a User

```tsx
import { useUpdateUser } from '~/features/users'

function EditUserForm({ userId }) {
	const updateUser = useUpdateUser()

	const handleSubmit = (data) => {
		updateUser.mutate({
			userId,
			data: {
				first_name: data.firstName,
				last_name: data.lastName,
			},
		})
	}

	return <form onSubmit={handleSubmit}>...</form>
}
```

### Deleting a User

```tsx
import { useDeleteUser } from '~/features/users'

function DeleteUserButton({ userId }) {
	const deleteUser = useDeleteUser()

	return <button onClick={() => deleteUser.mutate(userId)}>Delete User</button>
}
```

## Dependencies

- **React Query** - Server state management for user API calls
- **No feature dependencies** - This is a standalone feature

## Architecture

- `api/` - React Query hooks for user endpoints
- `components/` - User-related UI components
- `types/` - TypeScript type definitions
