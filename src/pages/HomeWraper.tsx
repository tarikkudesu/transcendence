import { useEffect } from 'react';
import Home from './Home';
import { useNavigate } from 'react-router-dom';
import WSProvider from '../Hooks/wsProvider';
import { WS_API } from '../services/API';
import { useAuth } from '../Hooks/AuthContext';
import NotifyWs from '../Hooks/notification';

const HomeWraper: React.FC<unknown> = () => {
	const { username } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!username) navigate('/');
	}, [navigate, username]);

	return (
		<>
			{username && (
				<WSProvider url={`${WS_API}/ws/v1/game/tar?username=${username}`} username={username}>
					<NotifyWs url={`${WS_API}/ws/v1/notification/${username}`}>
						<Home />
					</NotifyWs>
				</WSProvider>
			)}
		</>
	);
};

export default HomeWraper;
