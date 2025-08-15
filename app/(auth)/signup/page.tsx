'use client';

import Logo from '@/app/_components/Logo';
import { useNotification } from '@/app/_components/useNotify';
import { RequestResult, signup } from '@/app/_service/auth/calls';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useCallback, useState } from 'react';

const SignUp: React.FC<unknown> = () => {
	const router = useRouter();
	const { notify } = useNotification();
	const [type, setType] = useState<'password' | 'text'>('password');
	const [password, setPass] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const switchtype = useCallback(() => {
		if (type === 'password') setType('text');
		else setType('password');
	}, [type]);

	const signupCall = useCallback(async () => {
		if (!username || !password || !email) return;
		setIsLoading(true);
		const result: RequestResult = await signup({ email, username, password });
		if (result.message === 'success') {
			notify({ message: 'Success', success: true });
			router.push(`verify-account?email=${result.result?.email ?? ''}`);
		} else notify({ message: result.message, error: true });
		setIsLoading(false);
	}, [email, notify, password, router, username]);

	return (
		<main>
			<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<Logo />
				<Box height="24px" />
				<div className="p-12 bg-dark-700 w-[400px] md:w-[500px] mx-auto rounded-lg">
					<Text as="div" mb="4" mt="4" weight="bold" size="6">
						Create a YingYangPong account
					</Text>
					<Box height="12px" />
					<label className="text-sm text-dark-200">
						Email
						<input
							required
							minLength={4}
							maxLength={40}
							value={email}
							className="w-full my-1 outline-none rounded-sm p-3 text-sm bg-dark-500"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
							type="text"
							name="username"
						></input>
					</label>
					<Box height="12px" />
					<label className="text-sm text-dark-200">
						Username
						<input
							required
							minLength={4}
							maxLength={40}
							value={username}
							className="w-full my-1 outline-none rounded-sm p-3 text-sm bg-dark-500"
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
							className="w-full my-1 outline-none rounded-sm p-3 text-sm bg-dark-500"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setPass(e.target.value)}
							type={type}
							name="password"
						></input>
					</label>
					<Box height="20px" />
					<Flex justify="between" align="center">
						<Box />
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
						disabled={!password || !username || !email}
						className="w-full p-2.5 disabled:bg-dark-600 bg-accent-300 text-center"
						onClick={signupCall}
						loading={isLoading}
					>
						Sign Up
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
						Sign Up with Google
					</Button>
					<Box height="20px" />
					<Link href="/login" className="text-sm text-dark-200">
						Already have a YingYangPong account? <Text className="text-accent-300">Sign In</Text>
					</Link>
				</div>
			</div>
		</main>
	);
};

export default SignUp;
