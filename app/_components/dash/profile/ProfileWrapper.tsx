'use client';

import { useAuth } from '@/app/_service/AuthContext';
import React from 'react';
import DoomHistory from './DoomHistory';
import PongHistory from './PongHistory';
import Stats from './Stats';

const ProfileWrapper: React.FC = ({}) => {
	const { username } = useAuth();
	return (
		<>
			<Stats username={username} />
			<PongHistory username={username} />
			<DoomHistory username={username} />
		</>
	);
};

export default ProfileWrapper;
