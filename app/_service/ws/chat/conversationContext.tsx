import { createContext, useContext } from 'react';
import { Message } from './schemas';

class SocketState {
	// * Websocket vars
	error: boolean = false;
	close: boolean = false;
	open: boolean = false;

	conversation: Message[] = [];

	send: (message: string) => void = () => {};
}

export const conversationContext = createContext(new SocketState());

export function useConversationSocket() {
	return useContext(conversationContext);
}
