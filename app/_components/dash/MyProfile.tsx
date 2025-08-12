'use client';

import UserProfileContext from '@/app/_service/UserContext';
import React, { useContext } from 'react';
import Image from 'next/image';
import { Box, Text } from '@radix-ui/themes';

const MyDashboardProfile: React.FC = ({}) => {
	const { user } = useContext(UserProfileContext);

	return (
		<div className="py-8">
			<Image
				src={user.avatar ?? 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar175.png'}
				width={80}
				height={80}
				alt="My profile image"
				className="mx-auto border-4 border-accent-300 border-dashed rounded-full"
			/>
			<Box height="16px" />
			<Text as="div" align="center" size="4" weight="bold" className="text-white">
				{user.username}
			</Text>
			<Box height="4px" />
			<Text as="div" align="center" size="2" className="text-dark-200">
				{user.bio}
			</Text>
			<Box height="4px" />
			<Text as="div" align="center" size="2" className="text-dark-200">
				Joined at {user.created_at.slice(0, 10)}
			</Text>
		</div>
	);
};

export default MyDashboardProfile;
