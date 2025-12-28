export function truncateText(text: string, length: number) {
	let truncated = text.slice(0, length + 1)
	if (truncated.length === length + 1) {
		truncated += '...'
	}
	return truncated
}
