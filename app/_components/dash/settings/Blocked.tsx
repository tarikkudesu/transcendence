'use client';

import { useFriends } from '@/app/_service/friends/FriendContext';
import { BlockedFriend } from '@/app/_service/friends/schema';
import { useGET } from '@/app/_service/useFetcher';
import { Card, Text } from '@radix-ui/themes';
import React from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { User } from '../game/User';

const Blocked: React.FC = () => {
	const { isLoading, data } = useGET<BlockedFriend[]>({ url: `/friends/blocked` });
	const { isLoading: blocking, declineCall } = useFriends();
	if (isLoading) return <>Loading...</>;
	if (!data || data.length === 0) return <></>;

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Blocked Friends
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				Manage your list of blocked friends. Note that once you unblock someone, they won’t automatically be added back to your
				friends list.
			</Text>
			<Card>
				{data.map((ele, index) => (
					<div key={index} className="p-2 flex justify-between items-center gap-8">
						<User.Trigger
							username={ele.username}
							avatar={ele.avatar_url}
							extra={
								<Text as="div" size="1" weight="medium" className="text-dark-300">
									{ele.stat}
								</Text>
							}
						/>
						<PongButton
							loading={blocking}
							onClick={() => declineCall(ele.username)}
							className="bg-dark-900 hover:bg-red-600 hover:text-white"
						>
							Unblock
						</PongButton>
					</div>
				))}
			</Card>
		</div>
	);
};

export default Blocked;
