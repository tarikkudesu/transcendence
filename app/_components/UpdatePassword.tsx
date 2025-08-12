'use client';

import { Box, Button, Card, Flex, Text } from '@radix-ui/themes';
import React, { ChangeEvent, useCallback, useContext, useState } from 'react';
import { RequestResult, updatePassword } from '../_service/user/calls';
import { useNotification } from './useNotify';
import Link from 'next/link';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import UserProfileContext from '../_service/UserContext';

const UpdatePassword: React.FC = () => {
	const { user } = useContext(UserProfileContext);
	const { notify } = useNotification();
	const [type, setType] = useState<'password' | 'text'>('password');
	const [password, setPassword] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const switchType = useCallback(() => {
		setType((prev) => (prev === 'password' ? 'text' : 'password'));
	}, []);

	const updatePasswordCall = useCallback(async () => {
		if (!password) return;
		setIsLoading(true);
		const result: RequestResult = await updatePassword(user.username, { newpassword: password });
		if (result.message === 'success') notify({ message: 'Success', success: true });
		else notify({ message: result.message, error: true });
		setIsLoading(false);
	}, [password, user.username, notify]);

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
								className="w-full my-1 outline-none rounded-sm p-3 text-sm bg-dark-500"
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
					<Button
						disabled={!password}
						variant="outline"
						radius="small"
						color="gray"
						size="3"
						className="px-4 text-center bg-accent-300 text-sm text-black cursor-pointer disabled:bg-dark-600 disabled:text-dark-200"
						onClick={updatePasswordCall}
						loading={isLoading}
					>
						Update
					</Button>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdatePassword;
