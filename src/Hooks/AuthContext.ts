import { createContext, useContext } from 'react';

const authContextInitialState = {
	username: '',
	setUsername: (token: string) => {
		void token;
	},
};

export const authContext = createContext(authContextInitialState);

export function useAuth() {
	return useContext(authContext);
}
