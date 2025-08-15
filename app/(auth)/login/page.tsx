'use client';

import Logo from '@/app/_components/Logo';
import { useNotification } from '@/app/_components/useNotify';
import { login, RequestResult } from '@/app/_service/auth/calls';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useCallback, useState } from 'react';

const Login: React.FC<unknown> = () => {
	const router = useRouter();
	const { notify } = useNotification();
	const [type, setType] = useState<'password' | 'text'>('password');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [username, setUsername] = useState<string>('');
	const [password, setPass] = useState<string>('');

	const switchtype = useCallback(() => {
		if (type === 'password') setType('text');
		else setType('password');
	}, [type]);

	const loginCall = useCallback(async () => {
		if (!username || !password) return;
		setIsLoading(true);
		const result: RequestResult = await login({ username, password });
		if (result.message === 'success') {
			notify({ message: 'Success', success: true });
			// router.push(`2fa-authentication?email=${result.result?.email ?? ''}`); // ! restore Later
			router.push('/dash');
		} else notify({ message: result.message, error: true });
		setIsLoading(false);
	}, [notify, password, username]);

	return (
		<main>
			<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<Logo />
				<Box height="24px" />
				<div className="p-12 bg-dark-700 w-[400px] md:w-[500px] mx-auto rounded-lg">
					<Text as="div" mb="4" mt="4" weight="bold" size="6">
						Sign In to YingYangPong
					</Text>
					<Box height="12px" />
					<label className="text-sm text-dark-200">
						Username
						<input
							required
							minLength={4}
							maxLength={40}
							value={username}
							className="text-white w-full my-1 outline-none rounded-sm p-3 text-sm bg-dark-500"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
							type="text"
							name="username"
						></input>
					</label>
					<Box height="20px" />
					<label className="text-sm text-dark-200">
						Password
						<input
							required
							minLength={4}
							maxLength={40}
							value={password}
							className="text-white w-full my-1 outline-none rounded-sm p-3 text-sm bg-dark-500"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setPass(e.target.value)}
							type={type}
							name="password"
						></input>
					</label>
					<Box height="20px" />
					<Flex justify="between" align="center">
						<Link href="/forgot-password" className="text-sm text-dark-200 hover:text-accent-300">
							Forgot password?
						</Link>
						<label className="flex items-center gap-2 cursor-pointer select-none">
							<input type="checkbox" checked={type === 'text'} onChange={switchtype} className="peer hidden" />
							<span className="text-sm text-dark-200">show password</span>
							<CheckCircledIcon className="peer-checked:bg-accent-300 peer-checked:text-black text-dark-200 rounded-full" />
						</label>
					</Flex>
					<Box height="20px" />
					<Button
						radius="small"
						size="3"
						disabled={!password || !username}
						className="w-full p-2.5 disabled:bg-dark-600 bg-accent-300 text-center"
						onClick={loginCall}
						loading={isLoading}
					>
						Sign In
					</Button>
					<Box height="20px" />
					<Flex gap="6" my="2" justify="between" className="items-center">
						<Box height="2px" className="bg-dark-600 w-full"></Box>
						<Text className="text-dark-300 text-sm">Or</Text>
						<Box height="2px" className="bg-dark-600 w-full"></Box>
					</Flex>
					<Box height="20px" />
					<Button
						variant="outline"
						radius="small"
						color="gray"
						size="3"
						className="w-full p-2.5 text-center bg-transparent text-sm"
					>
						Sign in with Google
					</Button>
					<Box height="20px" />
					<Link href="/signup" className="text-sm text-dark-200">
						New to YingYangPong? <Text className="text-accent-300">Create Account</Text>
					</Link>
				</div>
			</div>
		</main>
	);
};

export default Login;
