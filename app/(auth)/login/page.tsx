'use client';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import Logo from '@/app/_components/mini/Logo';
import { useNotification } from '@/app/_components/mini/useNotify';
import { useAuth } from '@/app/_service/auth/authContext';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Box, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

const Login: React.FC<unknown> = () => {
	const { logincall, isLoading, data, error, reset } = useAuth();
	const [type, setType] = useState<'password' | 'text'>('password');
	const [username, setUsername] = useState<string>('');
	const [password, setPass] = useState<string>('');
	const { notify } = useNotification();
	const router = useRouter();

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			const email: string = data.email ?? '';
			reset();
			router.push(`2fa-authentication?email=${email ?? ''}`);
		}
		if (error) {
			notify({ message: error.message, error: true });
			reset();
		}
	}, [data, error, notify, reset]);

	const switchtype = useCallback(() => {
		if (type === 'password') setType('text');
		else setType('password');
	}, [type]);

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
							className="text-white w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-500"
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
							className="text-white w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-500"
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
					<PongButton
						loading={isLoading}
						disabled={!password || !username}
						onClick={() => logincall({ username, password })}
						className="w-full disabled:bg-dark-600 disabled:text-white bg-accent-300 text-black hover:bg-accent-200"
					>
						Sign In
					</PongButton>
					<Box height="20px" />
					<Flex gap="6" my="2" justify="between" className="items-center">
						<Box height="2px" className="bg-dark-600 w-full"></Box>
						<Text className="text-dark-300 text-sm">Or</Text>
						<Box height="2px" className="bg-dark-600 w-full"></Box>
					</Flex>
					<Box height="20px" />
					<PongButton
						loading={isLoading}
						className="w-full text-white hover:text-black bg-transparent hover:bg-accent-300 border border-accent-300"
					>
						Sign in with Google
					</PongButton>
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
