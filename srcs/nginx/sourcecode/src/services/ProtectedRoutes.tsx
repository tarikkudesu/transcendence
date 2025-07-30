import React, { useEffect } from 'react';
import useUser from './useUser';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@radix-ui/themes';

interface ProtectedRouteProps {
	children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const [authorized, loading] = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !authorized) navigate('/');
	}, [authorized, loading, navigate]);

	if (loading)
		return (
			<div className="h-screen w-screen flex justify-center items-center">
				<Spinner />
			</div>
		);

	if (authorized) return children;
};

export default ProtectedRoute;
