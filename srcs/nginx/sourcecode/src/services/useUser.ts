import { setUser, type User } from '../Redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../Redux/Store';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useUser = () => {
	const dispatch = useDispatch();
	const username: string = useSelector((state: RootState) => state.user.username);
	const [authorized, setAuthorized] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const { pathname } = useLocation();

	useEffect(() => {
		if (pathname === '/login' || pathname === '/signup' || pathname === '/verify' || pathname === '/') {
			setAuthorized(true);
			setLoading(false);
			return;
		}
		const getUser = async () => {
			try {
				const res = await fetch('http://10.13.100.159:3000/api/me/profile/' + username, { credentials: 'include' });
				const json: User = await res.json();
				if (!res.ok) throw new Error('');
				dispatch(setUser(json));
				setAuthorized(true);
				setLoading(false);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
			} catch (err: any) {
				setAuthorized(false);
				setLoading(false);
			}
		};
		getUser();
	}, [dispatch, pathname, username]);
	return [authorized, loading];
};

export default useUser;
