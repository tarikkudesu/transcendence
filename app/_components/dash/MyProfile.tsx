'use client';

import { useAuth } from '@/app/_service/AuthContext';
import { Box, Text } from '@radix-ui/themes';
import Image from 'next/image';
import React from 'react';

const MyDashboardProfile: React.FC = ({}) => {
	const { avatar, username, bio, created_at } = useAuth();

	return (
		<div className="py-8">
			<Image
				priority
				src={'/Logo.png'}
				width={80}
				height={80}
				alt="My profile image"
				className="mx-auto border-4 border-accent-300 border-dashed rounded-full"
			/>
			<Box height="16px" />
			<Text as="div" align="center" size="4" weight="bold" className="text-white">
				{username}
			</Text>
			<Box height="4px" />
			<Text as="div" align="center" size="2" className="text-dark-200">
				{bio}
			</Text>
			<Box height="4px" />
			<Text as="div" align="center" size="2" className="text-dark-200">
				Joined at {created_at.slice(0, 10)}
			</Text>
		</div>
	);
};

export default MyDashboardProfile;
