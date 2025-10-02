'use client';

import { Card, Flex, Text } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { useDeleteAccoutCall } from '@/app/_service/auth/Fetchers';
import { useNotification } from '../../mini/useNotify';

const DeleteAccount: React.FC = () => {
	const { notify } = useNotification();
	const { data, error, isLoading, reset, deleteaccountcall } = useDeleteAccoutCall();

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			reset();
		}
		if (error) {
			notify({ message: error.message, error: true });
			reset();
		}
	}, [data, error, notify, reset]);

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
					<PongButton
						loading={isLoading}
						disabled={isLoading}
						onClick={() => deleteaccountcall()}
						className="bg-red-600 text-white hover:bg-red-500"
					>
						Delete account
					</PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default DeleteAccount;
