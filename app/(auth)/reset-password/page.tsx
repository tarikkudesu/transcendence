'use client';

import Logo from '@/app/_components/mini/Logo';
import { useNotification } from '@/app/_components/mini/useNotify';
import { RequestResult, resetPassword } from '@/app/_service/auth/calls';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import router from 'next/router';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

const ResetPassword: React.FC<unknown> = () => {
	const searchParams = useSearchParams();
	const [password, setPass] = useState<string>('');
	const [repassword, setRePass] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const [type, setType] = useState<'password' | 'text'>('password');

	const { notify } = useNotification();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const switchtype = useCallback(() => {
		if (type === 'password') setType('text');
		else setType('password');
	}, [type]);

	useEffect(() => {
		const temp: string | null = searchParams.get('token');
		if (!temp) {
			router.push('/login');
			return;
		}
		setToken(temp);
	}, [searchParams]);

	const verifyCall = useCallback(async () => {
		if (!token || !password || !repassword) return;
		setIsLoading(true);
		const result: RequestResult = await resetPassword({ newPassword: password, repeatNewPassword: repassword, token });
		if (result.message === 'success') {
			notify({ message: 'Success', success: true });
		} else notify({ message: result.message, error: true });
		setIsLoading(false);
	}, [notify, password, repassword, token]);

	return (
		<main>
			<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<Logo />
				<Box height="24px" />
				<div className="p-12 bg-dark-700 w-[400px] md:w-[500px] mx-auto rounded-lg">
					<Text as="div" mb="2" mt="4" weight="bold" size="6">
						Reset your password?
					</Text>
					<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
						Enter your new password
					</Text>
					<Box height="12px" />
					<label className="text-sm text-dark-200">
						Password
						<input
							required
							minLength={4}
							maxLength={40}
							value={password}
							className="w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-500"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setPass(e.target.value)}
							type={type}
							name="password"
						></input>
					</label>
					<label className="text-sm text-dark-200">
						Repeat Password
						<input
							required
							minLength={4}
							maxLength={40}
							value={repassword}
							className="w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-500"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setRePass(e.target.value)}
							type={type}
							name="password"
						></input>
					</label>
					<Box height="20px" />
					<Button
						radius="small"
						size="3"
						disabled={!password || !repassword || !token}
						className="w-full p-2.5 disabled:bg-dark-600 bg-accent-300 text-center"
						onClick={verifyCall}
						loading={isLoading}
					>
						Reset Password
					</Button>

					<Box height="20px" />
					<Flex justify="between" align="center">
						<Link href="/forgot-password" className="text-sm text-dark-200 hover:text-accent-300">
							didn&apos;t receive the an email?
						</Link>
						<label className="flex items-center gap-2 cursor-pointer select-none">
							<input type="checkbox" checked={type === 'text'} onChange={switchtype} className="peer hidden" />
							<span className="text-sm text-dark-200">show password</span>
							<CheckCircledIcon className="peer-checked:bg-accent-300 peer-checked:text-black text-dark-200 rounded-full" />
						</label>
					</Flex>
					<Box height="20px" />
					<Link href="/login" className="text-sm text-accent-300">
						Return to Login
					</Link>
				</div>
			</div>
		</main>
	);
};

export default ResetPassword;
