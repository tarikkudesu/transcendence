'use client';

import React from 'react';
import { useAuth } from '../_service/AuthContext';

const Username: React.FC = () => {
	const { username } = useAuth();
	return <span>{username}</span>;
};

export default Username;
