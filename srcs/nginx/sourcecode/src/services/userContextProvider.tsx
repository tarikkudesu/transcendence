import { useSelector } from 'react-redux';
import type { User } from '../Redux/userSlice';
import { userContext } from './userContext';
import type { RootState } from '../Redux/Store';

interface userContextProviderProps {
	children: React.ReactNode;
}
const UserContextProvider: React.FC<userContextProviderProps> = ({ children }) => {
	const user: User = useSelector((state: RootState) => state.user);
	return <userContext.Provider value={user}>{children}</userContext.Provider>;
};

export default UserContextProvider;
