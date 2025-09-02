'use client';

import { useFriends } from '@/app/_service/friends/FriendContext';
import { useDeclineFriendCall } from '@/app/_service/friends/Mutaters';
import { Card, Text } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { useNotification } from '../../mini/useNotify';
import { User } from '../game/User';

const Blocked: React.FC = () => {
	const { notify } = useNotification();
	const { data, isLoading: blocking, error: blockError, declineCall } = useDeclineFriendCall();
	const { blocked, refetch } = useFriends();

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			refetch();
		}
		if (blockError) {
			notify({ message: blockError.message, error: true });
			refetch();
		}
	}, [blockError, data, notify, refetch]);

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Blocked Friends
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				Manage your list of blocked friends. Note that once you unblock someone, they won’t automatically be added back to your
				friends list.
			</Text>
			{blocked && (
				<Card>
					{blocked.length === 0 ? (
						<div className="text-dark-200 text-center text-sm">You have no blocked friends</div>
					) : (
						blocked.map((ele, index) => (
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
									onClick={() => declineCall({ to: ele.username })}
									className="bg-dark-900 hover:bg-red-600 hover:text-white"
								>
									Unblock
								</PongButton>
							</div>
						))
					)}
				</Card>
			)}
		</div>
	);
};

export default Blocked;
