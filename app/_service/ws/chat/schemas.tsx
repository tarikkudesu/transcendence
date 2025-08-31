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
