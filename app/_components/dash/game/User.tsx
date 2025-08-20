import { useGET } from '@/app/_service/useFetcher';
import { UserProfile } from '@/app/_service/user/schema';
import { Text } from '@radix-ui/themes';
import React from 'react';
import LoadingIndicator from '../../mini/Loading';
import SafeImage from '../../mini/SafeImage';
import UserCallout from './UserCallout';

interface UserProps {
	avatarclassName?: string;
	hideusername?: boolean;
	hideavatar?: boolean;
	username: string;
	extra?: string;
	size?: number;
}

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

const User: React.FC<UserProps> = ({ username, extra, hideusername, hideavatar, size, avatarclassName }) => {
	const { data, isLoading, error } = useGET<UserProfile>({ url: `${API_BASE}/users/${username}` });

	function content() {
		if (isLoading) return <LoadingIndicator size="md" />;
		if (error || !data)
			return (
				<SafeImage
					priority
					alt="player card"
					fallbackSrc="/Logo.png"
					width={size ? size : 36}
					height={size ? size : 36}
					src="/Logo.png"
					className={'rounded-full cursor-pointer ' + avatarclassName}
				></SafeImage>
			);
		else
			return (
				<>
					{!hideavatar && (
						<SafeImage
							priority
							alt="player card"
							fallbackSrc="/Logo.png"
							width={size ? size : 36}
							height={size ? size : 36}
							src={data.avatar}
							className={'rounded-full cursor-pointer ' + avatarclassName}
						></SafeImage>
					)}
					{!hideusername && (
						<Text as="div" className="ml-4 text-md">
							{username}
							{extra && (
								<Text as="div" className="text-xs">
									{extra}
								</Text>
							)}
						</Text>
					)}
				</>
			);
	}
	return (
		<UserCallout username={data ? data.username : ''} className="flex items-center p-2">
			{content()}
		</UserCallout>
	);
};

export default User;
