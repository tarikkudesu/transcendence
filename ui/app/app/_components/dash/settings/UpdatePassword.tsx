'use client';

import { useUpdatePassCall } from '@/app/_service/auth/Fetchers';
import { SvgCheckCircle } from '@/app/_svg/svg';
import { Box, Card, Flex, Text } from '@radix-ui/themes';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { useNotification } from '../../mini/useNotify';

const UpdatePassword: React.FC = () => {
	const { notify } = useNotification();
	const [type, setType] = useState<'password' | 'text'>('password');
	const { data, error, isLoading, reset, updatepasscall } = useUpdatePassCall();
	const [password, setPassword] = useState<string>('');

	const switchType = useCallback(() => {
		setType((prev) => (prev === 'password' ? 'text' : 'password'));
	}, []);

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			setPassword('');
			reset();
		}
		if (error) {
			notify({ message: error.message, error: true });
			setPassword('');
			reset();
		}
	}, [data, error, notify, reset]);

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Update Your Password
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				Please set a new, strong password to protect your account. Use a combination of letters, numbers, and symbols for the best
				security.
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
							<label className="flex items-center gap-2 cursor-pointer select-none">
								<input type="checkbox" checked={type === 'text'} onChange={switchType} className="peer hidden" />
								<span className="text-sm text-dark-200">show password</span>
								<SvgCheckCircle
									size={18}
									className="peer-checked:bg-black peer-checked:text-accent-300 text-dark-700 bg-dark-200 rounded-full"
								/>
							</label>
						</Flex>
					</Box>
					<PongButton
						className="bg-accent-300 text-black disabled:bg-dark-600 disabled:text-dark-200"
						onClick={() => updatepasscall({ newpassword: password })}
						disabled={!password || isLoading}
						loading={isLoading}
					>
						Save
					</PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdatePassword;
