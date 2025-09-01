'use client';

import { Card, Flex, Text } from '@radix-ui/themes';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { useNotification } from '../../mini/useNotify';
import { useUpdateUsernameCall } from '@/app/_service/auth/Fetchers';

const UpdateUsername: React.FC = () => {
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
						disabled={!newUsername || isLoading}
						loading={isLoading}
						onClick={() => updateusernamecall({ newusername: newUsername })}
					>
						Save
					</PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdateUsername;
