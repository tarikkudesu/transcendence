'use client';

import { Card, Flex, Text, TextField } from '@radix-ui/themes';
import React, { ChangeEvent, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';

const UpdateBio: React.FC = () => {
	const [bio, setBio] = useState<string>('');

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
					<PongButton className="bg-accent-300 hover:bg-accent-200 text-black disabled:bg-dark-600 disabled:text-dark-200">
						Save
					</PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdateBio;
