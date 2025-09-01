'use client';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import Logo from '@/app/_components/mini/Logo';
import { useNotification } from '@/app/_components/mini/useNotify';
import client from '@/app/_service/axios/client';
import { MutateResponse, PongError, ResetPasswordRequest } from '@/app/_service/schema';
import { SvgCheckCircle } from '@/app/_svg/svg';
import { Box, Flex, Text } from '@radix-ui/themes';
import { AxiosError, AxiosResponse } from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

function useResetPasswordCall() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<MutateResponse | null>(null);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setIsLoading(false);
	}, []);

	const fetchData = useCallback(async (body: ResetPasswordRequest) => {
		try {
			setIsLoading(true);
			const response: AxiosResponse<MutateResponse> = await client.post('/auth/reset-password', body);
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

	return { isLoading, error, data, resetpasscall: fetchData, reset };
}

const ResetPassword: React.FC<unknown> = () => {
	const router = useRouter();
	const { notify } = useNotification();
	const searchParams = useSearchParams();
	const [token, setToken] = useState<string>('');
	const [newPassword, setNewPass] = useState<string>('');
	const [repeatNewPassword, setRepeatNewPass] = useState<string>('');
	const [type, setType] = useState<'password' | 'text'>('password');
	const { resetpasscall, data, error, isLoading, reset } = useResetPasswordCall();

	const switchtype = useCallback(() => {
		if (type === 'password') setType('text');
		else setType('password');
	}, [type]);

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			reset();
			router.push('/main');
		}
		if (error) {
			notify({ message: error.message, error: true });
			reset();
		}
	}, [data, error, notify, reset, router]);

	useEffect(() => {
		const temp: string | null = searchParams.get('token');
		if (!temp) {
			router.push('/login');
			return;
		}
		setToken(temp);
	}, [router, searchParams]);

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
							value={newPassword}
							className="w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-500"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPass(e.target.value)}
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
							value={repeatNewPassword}
							className="w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-500"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setRepeatNewPass(e.target.value)}
							type={type}
							name="password"
						></input>
					</label>
					<Box height="20px" />
					<PongButton
						loading={isLoading}
						disabled={!newPassword || !repeatNewPassword || !token}
						onClick={() => resetpasscall({ newPassword, repeatNewPassword, token })}
						className="w-full disabled:bg-dark-600 disabled:text-white bg-accent-300 text-black hover:bg-accent-200"
					>
						Reset Password
					</PongButton>
					<Box height="20px" />
					<Flex justify="between" align="center">
						<Link href="/forgot-password" className="text-sm text-dark-200 hover:text-accent-300">
							didn&apos;t receive the an email?
						</Link>
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
					<Link href="/login" className="text-sm text-accent-300">
						Return to Login
					</Link>
				</div>
			</div>
		</main>
	);
};

export default ResetPassword;
