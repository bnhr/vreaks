import { create } from 'zustand'

interface CounterState {
	count: number
	increase: () => void
	decrease: () => void
	increaseBy: (by: number) => void
	decreaseBy: (by: number) => void
}

export const useCounterState = create<CounterState>()((set) => ({
	count: 0,
	increase: () => set((state) => ({ count: state.count + 1 })),
	decrease: () => set((state) => ({ count: state.count - 1 })),
	increaseBy: (by) => set((state) => ({ count: state.count + by })),
	decreaseBy: (by) => set((state) => ({ count: state.count - by })),
}))
