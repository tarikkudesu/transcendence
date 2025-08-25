'use client';

import { useUser } from '@/app/_service/user/userContext';
import React from 'react';
import DoomHistory from './DoomHistory';
import PongHistory from './PongHistory';
import Stats from './Stats';

const ProfileWrapper: React.FC = ({}) => {
	const { username } = useUser();
	return (
		<>
			<Stats username={username} />
			<PongHistory username={username} />
			<DoomHistory username={username} />
		</>
	);
};

export default ProfileWrapper;
