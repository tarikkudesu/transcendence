'use client';

import { useUser } from '@/app/_service/user/userContext';
import React from 'react';

const Username: React.FC = () => {
	const { username } = useUser();
	return <span className='text-accent-300'>{username}</span>;
};

export default Username;
