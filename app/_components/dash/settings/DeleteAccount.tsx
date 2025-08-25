'use client';

import { Button, Card, Flex, Text } from '@radix-ui/themes';
import React, { useCallback, useState } from 'react';
import { useNotification } from '../../mini/useNotify';
import { useUser } from '@/app/_service/user/userContext';

const DeleteAccount: React.FC = () => {
	const { notify } = useNotification();
	const { username } = useUser();
	const [isLoading, setIsLoading] = useState(false);

	const handleAccountCall = useCallback(async () => {
		if (!confirm('Are you sure you want to delete your account? This action is irreversible.')) return;
		setIsLoading(true);
		const result: RequestResult = await deleteUser(username);
		if (result.message === 'success') notify({ message: 'Account deleted successfully', success: true });
		else notify({ message: result.message, error: true });
		setIsLoading(false);
	}, [notify, username]);

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Account Deletion
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				This action is irreversible. Once you delete your account, restoring your account or any associated data will be impossible.
			</Text>
			<Card>
				<Flex justify="between" align="center" p="2">
					<Text as="div" weight="bold" size="2" className="text-white">
						Delete my YingYangPong account
					</Text>
					<Button
						color="gray"
						radius="small"
						size="3"
						className="px-4 text-center bg-red-600 text-sm text-white font-bold"
						onClick={handleAccountCall}
						loading={isLoading}
					>
						Delete account
					</Button>
				</Flex>
			</Card>
		</div>
	);
};

export default DeleteAccount;
