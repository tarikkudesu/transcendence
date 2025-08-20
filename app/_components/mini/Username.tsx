'use client';

import { useAuth } from '@/app/_service/AuthContext';
import React from 'react';

const Username: React.FC = () => {
	const { username } = useAuth();
	return <span>{username}</span>;
};

export default Username;
