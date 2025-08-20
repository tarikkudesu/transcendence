'use client';

import { RequestResult } from '@/app/_service/auth/calls';
import { useAuth } from '@/app/_service/AuthContext';
import { updateUsername } from '@/app/_service/user/calls';
import { Button, Card, Flex, Text, TextField } from '@radix-ui/themes';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { useNotification } from '../../mini/useNotify';

const UpdateUsername: React.FC = () => {
	const { username } = useAuth();
	const { notify } = useNotification();
	const [newUsername, setNewUsername] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const updateUsernameCall = useCallback(async () => {
		if (!newUsername) return;
		setIsLoading(true);
		const result: RequestResult = await updateUsername(username, { newusername: newUsername });
		if (result.message === 'success') notify({ message: 'Success', success: true });
		else notify({ message: result.message, error: true });
		setIsLoading(false);
	}, [newUsername, notify, username]);

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
					<TextField.Root
						value={newUsername}
						placeholder="Enter your new username…"
						className="flex-grow outline-none"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setNewUsername(e.target.value)}
					/>
					<Button
						disabled={!newUsername}
						variant="outline"
						radius="small"
						color="gray"
						size="3"
						className="px-4 text-center bg-accent-300 text-sm text-black cursor-pointer disabled:bg-dark-600 disabled:text-dark-200"
						onClick={updateUsernameCall}
						loading={isLoading}
					>
						Save
					</Button>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdateUsername;
