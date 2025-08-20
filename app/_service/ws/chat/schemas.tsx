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
	message: string;
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
