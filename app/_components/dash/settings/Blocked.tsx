'use client';

import client from '@/app/_service/axios/client';
import { useBlockFriendCall } from '@/app/_service/friends/Mutaters';
import { BlockedFriend } from '@/app/_service/schema';
import { Card, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { Spinner } from '../../mini/Loading';
import { useNotification } from '../../mini/useNotify';
import { User } from '../game/User';

const Blocked: React.FC = () => {
	const { notify } = useNotification();
	const { isLoading: blocking, error: blockError, blockCall } = useBlockFriendCall();
	const fetchData = (): Promise<BlockedFriend[]> => client.get(`/friends/blocked`).then((response) => response.data);
	const { data, isPending } = useQuery({
		queryKey: ['friendsblocked'],
		queryFn: fetchData,
	});

	useEffect(() => {
		if (blockError) notify({ message: blockError.message, error: true });
	}, [blockError, notify]);

	if (isPending) return <Spinner />;

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Blocked Friends
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				Manage your list of blocked friends. Note that once you unblock someone, they won’t automatically be added back to your
				friends list.
			</Text>
			{data && (
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
								onClick={() => blockCall({ to: ele.username })}
								className="bg-dark-900 hover:bg-red-600 hover:text-white"
							>
								Unblock
							</PongButton>
						</div>
					))}
				</Card>
			)}
		</div>
	);
};

export default Blocked;
