'use client';

import { Card, Flex, Text } from '@radix-ui/themes';
import React from 'react';
import { PongButton } from '../../buttons/ServerButtons';

const DeleteAccount: React.FC = () => {
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
					{/* <PongButton loading={isLoading} onClick={() => deleteaccountcall()} className="bg-red-600 text-white hover:bg-red-500">
						Delete account
					</PongButton> */}
				</Flex>
			</Card>
		</div>
	);
};

export default DeleteAccount;
