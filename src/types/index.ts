import { ReactNode } from 'react'

export interface ChildrenProps {
	children: ReactNode
}

export type DMYProps = 'DDMMYYYY' | 'MMDDYYYY' | 'YYYYMMDD'
export type DateInputProps = string | number

export interface SuccessResult<T> {
	statusCode: number
	message: string
	data: T
}
