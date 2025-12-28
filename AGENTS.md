# Agent Guidelines

This document provides guidelines for AI agents working on this frontend project.

## Package Manager

**Always use Bun instead of Node.js, npm, pnpm, or yarn.**

- `bun install` - Install dependencies
- `bun run <script>` - Run package.json scripts
- `bun <file>` - Execute TypeScript/JavaScript files directly
- `bun test` - Run tests
- `bun build` - Build the project

Bun automatically loads `.env` files, so no need for dotenv packages.

## File and Folder Naming

**Use kebab-case for all files and folders.**

- ✅ `user-profile.tsx`, `api-client.ts`, `auth-provider/`
- ❌ `UserProfile.tsx`, `apiClient.ts`, `AuthProvider/`

Exception: Component files may use PascalCase if preferred by the team, but kebab-case is recommended for consistency.

## React Best Practices

### Component Structure

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Extract reusable logic into custom hooks
- Use proper TypeScript types for props

```tsx
interface UserCardProps {
  name: string;
  email: string;
  onEdit?: () => void;
}

export function UserCard({ name, email, onEdit }: UserCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      {onEdit && <button onClick={onEdit}>Edit</button>}
    </div>
  );
}
```

### State Management

**We use a three-tier state management approach:**

1. **Server State → TanStack Query (React Query)**
   - ALL data from APIs (user data, posts, etc.)
   - Authentication state (derive from `/me` endpoint)
   - Automatic caching, refetching, and synchronization
   - Built-in loading and error states

2. **Client State → Zustand**
   - UI state (theme, sidebar open/closed, modals)
   - Client-only preferences (language, notifications)
   - Multi-step form data
   - Shopping carts or temporary collections
   - Global notifications/toasts

3. **Local State → useState/useReducer**
   - Component-specific state
   - Form inputs (single-page forms)
   - Toggle states within a component
   - Use `useReducer` for complex local state logic

**NEVER use React Context for state management.** Context causes unnecessary re-renders and adds boilerplate. Use Zustand instead.

**NEVER duplicate server data in Zustand.** If it comes from an API, it belongs in React Query.

**Examples:**

```typescript
// ✅ CORRECT: Server state with React Query
export function useAuth() {
  const { data: currentUser, isLoading } = useMeQuery()
  return {
    user: currentUser?.data,
    isAuthenticated: !!currentUser?.data,
    isLoading,
  }
}

// ✅ CORRECT: Client state with Zustand
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}))

// ✅ CORRECT: Local state with useState
function SearchInput() {
  const [query, setQuery] = useState('')
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}

// ❌ WRONG: Don't use Context
const ThemeContext = createContext() // NO!

// ❌ WRONG: Don't duplicate server data in Zustand
const useAuthStore = create((set) => ({
  user: null, // This should be in React Query!
  setUser: (user) => set({ user }),
}))
```

### Performance

- Use `React.memo()` for expensive components
- Use `useMemo()` and `useCallback()` to prevent unnecessary re-renders
- Lazy load routes and heavy components with `React.lazy()`
- Avoid inline function definitions in JSX when possible

## TypeScript Best Practices

### Type Safety

- Enable strict mode in `tsconfig.json`
- Avoid `any` - use `unknown` if type is truly unknown
- Define interfaces for all props, API responses, and data structures
- Use type guards for runtime type checking

```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

function isError(response: ApiResponse<unknown>): response is ApiResponse<never> {
  return response.error !== undefined;
}
```

### Naming Conventions

- Use PascalCase for types and interfaces: `UserProfile`, `ApiResponse`
- Use camelCase for variables and functions: `getUserData`, `isLoading`
- Use UPPER_SNAKE_CASE for constants: `API_BASE_URL`, `MAX_RETRIES`
- Prefix interfaces with `I` only if it adds clarity (generally avoid)

## Vite Configuration

- Keep `vite.config.ts` minimal and focused
- Use environment variables for configuration
- Configure path aliases for cleaner imports
- Enable source maps for development

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Testing Best Practices

### Test Structure

- Use `bun test` for running tests
- Follow the Arrange-Act-Assert pattern
- Write descriptive test names that explain the expected behavior
- Test user behavior, not implementation details

```typescript
import { test, expect, describe } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { UserCard } from './user-card';

describe('UserCard', () => {
  test('displays user name and email', () => {
    render(<UserCard name="John Doe" email="john@example.com" />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<UserCard name="John" email="john@example.com" onEdit={onEdit} />);
    
    screen.getByText('Edit').click();
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
```

### What to Test

- Component rendering with different props
- User interactions (clicks, form submissions)
- Conditional rendering logic
- Custom hooks behavior
- API integration (with mocks)

### What Not to Test

- Third-party library internals
- Trivial code (simple getters/setters)
- Implementation details (internal state, private methods)

## Project Structure

Follow a feature-based structure:

```
src/
├── app/           # App-level configuration, providers
├── features/      # Feature modules (auth, users, etc.)
├── pages/         # Page components
├── shared/        # Shared utilities, components, hooks
├── widgets/       # Complex reusable UI components
├── assets/        # Static assets (images, fonts)
└── test/          # Test utilities and setup
```

## Code Quality

### Formatting and Linting

- Use Prettier for consistent formatting
- Use ESLint for code quality
- Run linters before commits (husky + lint-staged)
- Fix all warnings before committing

### Code Review Checklist

- [ ] Code follows naming conventions
- [ ] TypeScript types are properly defined
- [ ] Components are properly tested
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Loading and error states are handled
- [ ] Accessibility attributes are present (aria-labels, roles)
- [ ] Code is DRY (Don't Repeat Yourself)

## Git Workflow

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Keep commits atomic and focused
- Write clear commit messages
- Create feature branches from main
- Squash commits before merging

## Performance Optimization

- Code split routes and heavy components
- Optimize images (use WebP, lazy loading)
- Minimize bundle size (analyze with `bun build --analyze`)
- Use production builds for deployment
- Implement proper caching strategies
- Avoid unnecessary re-renders

## Accessibility

- Use semantic HTML elements
- Add proper ARIA labels and roles
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast
- Support reduced motion preferences

## Security

- Sanitize user input
- Use environment variables for sensitive data
- Implement proper authentication and authorization
- Validate data on both client and server
- Keep dependencies updated
- Use HTTPS in production

## Documentation

- Document complex logic with comments
- Keep README.md up to date
- Document API endpoints and data structures
- Add JSDoc comments for public functions
- Maintain a CHANGELOG for releases
