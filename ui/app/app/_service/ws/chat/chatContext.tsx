import { createContext, useContext } from 'react';
import { Message, OuterMessage } from '../../schema';

class SocketState {
	lastMessage: (u: string) => Message | undefined = (u: string) => void u;
	panel: OuterMessage[] = [];
}

export const chatContext = createContext(new SocketState());

export function useChatSocket() {
	return useContext(chatContext);
}
