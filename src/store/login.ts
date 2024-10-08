import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LoginState {
	hasLoggedIn: boolean
	login: () => void
	logout: () => void
}

export const useLoginState = create<LoginState>()(
	persist(
		(set) => ({
			hasLoggedIn: false,
			login: () => set({ hasLoggedIn: true }),
			logout: () => set({ hasLoggedIn: false }),
		}),
		{
			name: 'hasLoggedIn',
		},
	),
)
