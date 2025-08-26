'use client';

import { useAuth } from '@/app/_service/auth/authContext';
import { Card, Flex, Text } from '@radix-ui/themes';
import router from 'next/router';
import React, { useEffect } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { useNotification } from '../../mini/useNotify';

const DeleteAccount: React.FC = () => {
	const { deleteaccountcall, isLoading, error, data } = useAuth();
	const { notify } = useNotification();

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			router.push('/login');
		}
		if (error) {
			notify({ message: error.message, error: true });
		}
	}, [data, error, notify]);

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
					<PongButton loading={isLoading} onClick={() => deleteaccountcall()} className="bg-red-600 text-white hover:bg-red-500">
						Delete account
					</PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default DeleteAccount;
