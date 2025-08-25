'use client';

import { useMutate } from '@/app/_service/useFetcher';
import { UpdatePasswordRequest } from '@/app/_service/user/schema';
import { useUser } from '@/app/_service/user/userContext';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Box, Card, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { useNotification } from '../../mini/useNotify';
const UpdatePassword: React.FC = () => {
	const { username } = useUser();
	const { notify } = useNotification();
	const [type, setType] = useState<'password' | 'text'>('password');
	const { fetchData, isLoading, error, data } = useMutate<UpdatePasswordRequest>();
	const [password, setPassword] = useState<string>('');

	const switchType = useCallback(() => {
		setType((prev) => (prev === 'password' ? 'text' : 'password'));
	}, []);

	const updatePasswordCall = useCallback(async () => {
		if (!password) return;
		fetchData({
			url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile/password/${username}`,
			method: 'PUT',
			body: { newpassword: password },
		});
	}, [fetchData, password, username]);

	useEffect(() => {
		if (error) notify({ message: error.message, error: true });
		if (data) notify({ message: 'Password updated successfully', success: true });
	}, [data, error, notify]);

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Update your password
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				This action is irreversible. Once you delete your account, restoring your account or any associated data will be impossible.
			</Text>
			<Card>
				<Flex justify="between" align="center" gap="9" p="2">
					<Box className="flex-grow">
						<label className="text-sm text-dark-200">
							Password
							<input
								required
								minLength={4}
								maxLength={40}
								value={password}
								className="w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-500"
								onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
								type={type}
								name="password"
							/>
						</label>
						<Box height="8px" />
						<Flex justify="between" align="center">
							<Link href="/forgot-password" className="text-sm text-dark-200 hover:text-accent-300">
								Forgot password?
							</Link>
							<label className="flex items-center gap-2 cursor-pointer select-none">
								<input type="checkbox" checked={type === 'text'} onChange={switchType} className="peer hidden" />
								<span className="text-sm text-dark-200">show password</span>
								<CheckCircledIcon className="peer-checked:bg-accent-300 peer-checked:text-black text-dark-200 rounded-full" />
							</label>
						</Flex>
					</Box>
					<PongButton
						className="bg-accent-300 text-black disabled:bg-dark-600 disabled:text-dark-200"
						disabled={!password}
						onClick={updatePasswordCall}
						loading={isLoading}
					></PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdatePassword;
