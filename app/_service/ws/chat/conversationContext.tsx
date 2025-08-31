import { createContext, useContext } from 'react';
import { Message } from './schemas';

class SocketState {
	conversation: Message[] = [];
	send: (message: string) => void = () => {};
}

export const conversationContext = createContext(new SocketState());

export function useConversationSocket() {
	return useContext(conversationContext);
}
