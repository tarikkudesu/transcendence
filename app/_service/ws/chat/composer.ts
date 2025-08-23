export function ChatMessage(c: string): string {
	return JSON.stringify({ message: c });
}
