import { create } from 'zustand'

interface LoginState {
	hasLoggedIn: boolean
	login: () => void
	logout: () => void
}

const useLoginState = create<LoginState>()((set) => ({
	hasLoggedIn: false,
	login: () => set(() => ({ hasLoggedIn: true })),
	logout: () => set(() => ({ hasLoggedIn: false })),
}))

export default useLoginState
