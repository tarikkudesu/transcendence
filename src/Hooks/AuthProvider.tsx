import { useCallback, useEffect, useState } from 'react';
import { authContext } from './AuthContext';

interface AuthProviderProps {
	children: React.ReactNode;
}
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [username, setUsername_] = useState<string>(localStorage.getItem('username') ?? '');

	const setUsername = useCallback((newUsername: string) => {
		setUsername_(newUsername);
	}, []);

	useEffect(() => {
		localStorage.setItem('username', username);
	}, [username]);

	return (
		<>
			<authContext.Provider value={{ username, setUsername }}>{children}</authContext.Provider>
		</>
	);
};

export default AuthProvider;
