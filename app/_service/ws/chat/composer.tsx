import { AddMessage, EventIN, RequestMessages } from './schemas';

export function ChatMessage(e: 'REQUESTUSER' | 'NEWMESSAGE' | 'NONE', c: RequestMessages | AddMessage | null): string {
	if (e !== 'NONE' && c) return JSON.stringify(new EventIN(e, c));
	return '';
}
