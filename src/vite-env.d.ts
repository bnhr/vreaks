/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_NAME: string
	readonly VITE_BE_URL: string
	readonly VITE_MODE: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
