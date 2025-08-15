'use client';

import { Button, Card, Flex, Text, TextField } from '@radix-ui/themes';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { RequestResult } from '../_service/auth/calls';
import { useAuth } from '../_service/AuthContext';
import { updateBio } from '../_service/user/calls';
import { useNotification } from './useNotify';

const UpdateBio: React.FC = () => {
	const { username } = useAuth();
	const { notify } = useNotification();
	const [bio, setBio] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const updateBioCall = useCallback(async () => {
		if (!bio) return;
		setIsLoading(true);
		const result: RequestResult = await updateBio(username, { bio });
		if (result.message === 'success') notify({ message: 'Success', success: true });
		else notify({ message: result.message, error: true });
		setIsLoading(false);
	}, [bio, username, notify]);

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Update your bio
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				This action is irreversible. Once you delete your account, restoring your account or any associated data will be impossible.
			</Text>
			<Card>
				<Flex justify="between" align="center" p="2" gap="9">
					<TextField.Root
						value={bio}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setBio(e.target.value)}
						placeholder="Enter your bio…"
						className="flex-grow outline-none"
					/>
					<Button
						disabled={!bio}
						variant="outline"
						radius="small"
						color="gray"
						size="3"
						className="px-4 text-center bg-accent-300 text-sm text-black cursor-pointer disabled:bg-dark-600 disabled:text-dark-200"
						onClick={updateBioCall}
						loading={isLoading}
					>
						Save
					</Button>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdateBio;
