'use client';

import { useMutate } from '@/app/_service/useFetcher';
import { UpdateUsernameRequest } from '@/app/_service/user/schema';
import { useUser } from '@/app/_service/user/userContext';
import { Card, Flex, Text } from '@radix-ui/themes';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { useNotification } from '../../mini/useNotify';
import { useAuth } from '@/app/_service/auth/authContext';

const UpdateUsername: React.FC = () => {
	const { username } = useUser();
	const { notify } = useNotification();
	const { fetchData, isLoading, error, data } = useMutate<UpdateUsernameRequest>();
	const [newUsername, setNewUsername] = useState<string>('');
	const { logoutcall } = useAuth();

	const updateUsernameCall = useCallback(async () => {
		if (!newUsername) return;
		fetchData({
			url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile/username/${username}`,
			method: 'PUT',
			body: { newusername: newUsername },
		});
	}, [fetchData, newUsername, username]);

	useEffect(() => {
		if (error) notify({ message: error.message, error: true });
		if (data) {
			notify({ message: 'Username updated successfully', success: true });
			logoutcall();
		}
	}, [data, error, logoutcall, notify]);

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Update your username
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				This action is irreversible. Once you delete your account, restoring your account or any associated data will be impossible.
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
						disabled={!newUsername}
						onClick={updateUsernameCall}
						loading={isLoading}
					>
						Save
					</PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdateUsername;
