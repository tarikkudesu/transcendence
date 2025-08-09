import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeWraper from '../pages/HomeWraper';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC<unknown> = () => {
	const { username } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!username) navigate('/');
	}, [navigate, username]);

	return <HomeWraper />;
};

export default ProtectedRoute;
