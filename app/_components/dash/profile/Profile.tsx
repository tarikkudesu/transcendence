'use client';

import { useUser } from '@/app/_service/user/userContext';
import { Box, Text } from '@radix-ui/themes';

import React from 'react';
import SafeImage from '../../mini/SafeImage';
import { formatDate } from '../chat/ChatMessage';

const DashboardProfile: React.FC = ({}) => {
	const { avatar, username, bio, created_at } = useUser();

	return (
		<>
			<div className="pt-[64px]">
				<SafeImage
					fallbackSrc="/Logo.png"
					priority
					src={avatar}
					width={100}
					height={100}
					alt="My profile image"
					className="mx-auto border-4 border-accent-300 border-dashed rounded-full object-cover aspect-square"

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
					Joined {formatDate(Number(created_at))}
				</Text>
			</div>
		</>
	);
};

export default DashboardProfile;
