'use client';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import Logo from '@/app/_components/mini/Logo';
import { useNotification } from '@/app/_components/mini/useNotify';
import client from '@/app/_service/axios/client';
import { MutateResponse, PongError, SignupRequest } from '@/app/_service/schema';
import { SvgCheckCircle } from '@/app/_svg/svg';
import { Box, Flex, Text } from '@radix-ui/themes';
import { AxiosError, AxiosResponse } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function useSignupCall() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<MutateResponse | null>(null);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setIsLoading(false);
	}, []);

	const fetchData = useCallback(async (body: SignupRequest) => {
		try {
			setIsLoading(true);
			const response: AxiosResponse<MutateResponse> = await client.post('/auth/signup', body);
			setData(response.data);
		} catch (err) {
			if (err instanceof AxiosError && err.response) {
				setError({
					error: err.response.statusText,
					statusCode: err.response.status,
					message: err.response.data.message,
				});
			} else {
				setError({
					error: 'Unknown Error',
					statusCode: 520,
					message: 'Something went wrong, Please try again later',
				});
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { isLoading, error, data, signupcall: fetchData, reset };
}

const SignUp: React.FC<unknown> = () => {
	const router = useRouter();
	const { notify } = useNotification();
	const [email, setEmail] = useState<string>('');
	const [password, setPass] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const { signupcall, data, error, isLoading, reset } = useSignupCall();
	const [type, setType] = useState<'password' | 'text'>('password');

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			reset();
			router.push("verify-account");
		}
		if (error) {
			notify({ message: error.message, error: true });
			reset();
		}
	}, [data, email, error, notify, reset, router]);

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
							className="w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-500"
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
							className="w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-500"
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
							className="w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-500"
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
							<SvgCheckCircle
								size={18}
								className="peer-checked:bg-black peer-checked:text-accent-300 text-dark-700 bg-dark-200 rounded-full"
							/>
						</label>
					</Flex>
					<Box height="20px" />
					<PongButton
						loading={isLoading}
						disabled={!password || !username || !email}
						onClick={() => signupcall({ username, password, email })}
						className="w-full disabled:bg-dark-600 disabled:text-white bg-accent-300 text-black hover:bg-accent-200"
					>
						Sign Up
					</PongButton>
					<Box height="20px" />
					<Flex gap="6" my="2" justify="between" className="items-center">
						<Box height="2px" className="bg-dark-600 w-full"></Box>
						<Text className="text-dark-300 text-sm">Or</Text>
						<Box height="2px" className="bg-dark-600 w-full"></Box>
					</Flex>
					<Box height="20px" />
					<Link href={`${API_BASE}/auth/google`}>
						<PongButton className="w-full text-white hover:text-white bg-transparent hover:bg-accent-300 border border-accent-300">
							Sign up with Google
						</PongButton>
					</Link>
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
