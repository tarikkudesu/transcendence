import { createContext, useContext } from 'react';
import * as Main from './index';

class SocketState {
	gid: string = '';
	won: boolean = false;
	lost: boolean = false;
	waiting: boolean = false;
	nothing: boolean = false;
	disconnected: boolean = false;
	doom: Main.ClientCardOfDoom | null = null;
	send: (message: string) => void = () => {};
}

export const doomContext = createContext(new SocketState());

export function useDoomSocket() {
	return useContext(doomContext);
}
