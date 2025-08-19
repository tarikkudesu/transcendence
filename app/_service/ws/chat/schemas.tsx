export class Message {
	message: string = '';
	sender: string = '';
	receiver: string = '';
	date: string = '';
}

export class OuterMessage {
	friend: string = '';
	avatar: string = '';
	lastMessage: Message = new Message();
}

export interface AddMessage {
	to: string;
	message: string;
}

export interface RequestMessages {
	user: string;
}

export class EventIN {
	event: 'REQUESTUSER' | 'NEWMESSAGE' | 'NONE' = 'NONE';
	content: RequestMessages | AddMessage | null = null;
	constructor(e: 'REQUESTUSER' | 'NEWMESSAGE' | 'NONE', c: RequestMessages | AddMessage | null) {
		this.content = c;
		this.event = e;
	}
}

export class EventOut {
	event: 'UNREAD' | 'USER' | 'NONE' = 'NONE';
	content: OuterMessage[] | Message[] = [];
}

export function isMessageArray(arr: unknown): arr is Message[] {
	return (
		Array.isArray(arr) &&
		arr.every(
			(item) =>
				typeof item === 'object' && item !== null && 'message' in item && 'sender' in item && 'date' in item && 'avatar' in item
		)
	);
}
