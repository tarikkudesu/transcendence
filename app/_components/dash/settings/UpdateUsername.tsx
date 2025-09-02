'use client';

import { Card, Flex, Text } from '@radix-ui/themes';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { useNotification } from '../../mini/useNotify';
import { useUpdateUsernameCall } from '@/app/_service/auth/Fetchers';
import { useUser } from '@/app/_service/user/userContext';

const UpdateUsername: React.FC = () => {
	const { username } = useUser();
	const { notify } = useNotification();
	const [newUsername, setNewUsername] = useState<string>('');
	const { data, error, isLoading, reset, updateusernamecall } = useUpdateUsernameCall();

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			reset();
			location.reload();
		}
		if (error) {
			notify({ message: error.message, error: true });
			reset();
		}
	}, [data, error, notify, reset]);

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Update Your Username
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				You can set a new username, but choose carefully. Changing it will affect how others mention you, and your old name may
				become available to someone else.
			</Text>
			<Card>
				<Flex justify="between" align="center" gap="9" p="2">
					<input
						required
						minLength={4}
						maxLength={40}
						value={newUsername}
						placeholder="Enter your new username…"
						className="w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-950"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setNewUsername(e.target.value)}
						type="text"
						name="text"
					/>
					<PongButton
						className="bg-accent-300 text-black disabled:bg-dark-600 disabled:text-dark-200"
						disabled={!newUsername || isLoading}
						loading={isLoading}
						onClick={() => {
							if (username !== newUsername) updateusernamecall({ newusername: newUsername });
						}}
					>
						Save
					</PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdateUsername;
