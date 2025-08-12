'use client';

import React, { useContext } from 'react';
import UserProfileContext from '../_service/UserContext';

const Username: React.FC = () => {
	const { user } = useContext(UserProfileContext);
	return <span>{user.username}</span>;
};

export default Username;
