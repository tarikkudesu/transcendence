'use client';

import { useUpdateBioCall } from '@/app/_service/auth/Fetchers';
import { useUser } from '@/app/_service/user/userContext';
import { Card, Flex, Text } from '@radix-ui/themes';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { useNotification } from '../../mini/useNotify';

const UpdateBio: React.FC = () => {
	const { bio: old } = useUser();
	const [bio, setBio] = useState<string>(old);
	const { notify } = useNotification();
	const { data, error, isLoading, reset, updatebiocall } = useUpdateBioCall();


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
				Update your bio
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				This action is irreversible. Once you delete your account, restoring your account or any associated data will be impossible.
			</Text>
			<Card>
				<Flex justify="between" align="center" p="2" gap="9">
					<textarea
						required
						minLength={4}
						maxLength={1000}
						value={bio}
						className="text-white w-full my-1 outline-none rounded-md p-3 text-sm border border-dark-500 bg-transparent resize-y h-40 min-h-20 max-h-60"
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
						name="bio"
					></textarea>
					<PongButton
						onClick={() => {
							if (bio) updatebiocall({ bio });
						}}
						loading={isLoading}

						className="bg-accent-300 hover:bg-accent-200 text-black disabled:bg-dark-600 disabled:text-dark-200"
					>
						Save
					</PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdateBio;
