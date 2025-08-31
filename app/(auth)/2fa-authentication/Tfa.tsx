'use client';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import Logo from '@/app/_components/mini/Logo';
import { useNotification } from '@/app/_components/mini/useNotify';
import client from '@/app/_service/axios/client';
import { MutateResponse, PongError, ResendOtpRequest, Verify2FARequest } from '@/app/_service/schema';
import { Box, Text } from '@radix-ui/themes';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

function useResendOtpCall() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<MutateResponse | null>(null);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setIsLoading(false);
	}, []);

	const fetchData = useCallback(async (body: ResendOtpRequest) => {
		try {
			setIsLoading(true);
			const response: AxiosResponse<MutateResponse> = await client.post('/auth/resend-otp', body);
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

	return { isLoading, error, data, resendotp: fetchData, reset };
}

function useTwofaCall() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<MutateResponse | null>(null);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setIsLoading(false);
	}, []);

	const fetchData = useCallback(async (body: Verify2FARequest) => {
		try {
			setIsLoading(true);
			const response: AxiosResponse<MutateResponse> = await client.post('/auth/verify-2fa', body);
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

	return { isLoading, error, data, twofacall: fetchData, reset };
}

export const ResendCode: React.FC<{ email: string }> = ({ email }) => {
	const { notify } = useNotification();
	const { resendotp, data, error, isLoading, reset } = useResendOtpCall();

	useEffect(() => {
		if (data) {
			notify({ message: data.message });
			reset();
		}
		if (error) {
			notify({ message: error.message, error: true });
			reset();
		}
	}, [data, error, notify, reset]);

	return (
		<button disabled={isLoading} onClick={() => resendotp({ email })} className="text-sm text-dark-200 hover:text-accent-300">
			resend code?
		</button>
	);
};

const Tfa: React.FC<unknown> = () => {
	const router = useRouter();
	const { notify } = useNotification();
	const searchParams = useSearchParams();
	const [code, setCode] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const { twofacall, data, error, isLoading, reset } = useTwofaCall();

	useEffect(() => {
		if (data) {
			notify({ message: data.message });
			reset();
			router.push('/main');
		}
		if (error) {
			notify({ message: error.message, error: true });
			reset();
		}
	}, [data, error, notify, reset]);

	useEffect(() => {
		const mail: string | null = searchParams.get('email');
		if (!mail) {
			router.push('/login');
			return;
		}
		setEmail(mail);
	}, [router, searchParams]);

	return (
		<main>
			<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<Logo />
				<Box height="24px" />
				<div className="p-12 bg-dark-700 w-[400px] md:w-[500px] mx-auto rounded-lg">
					<Text as="div" mb="2" mt="4" weight="bold" size="6">
						Two factor authentication
					</Text>
					<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
						YingYangPong has sent a verification code to your email
					</Text>
					<Box height="12px" />
					<label className="text-sm text-dark-200">
						Verification Code
						<input
							required
							minLength={6}
							maxLength={6}
							value={code}
							className="w-full my-1 outline-none rounded-md p-3 text-sm bg-dark-500"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
							type="text"
							name="code"
						></input>
					</label>
					<Box height="20px" />
					<ResendCode email={email} />
					<Box height="20px" />
					<PongButton
						loading={isLoading}
						disabled={!code || !email || code.length !== 6}
						onClick={() => twofacall({ email, verificationCode: code })}
						className="w-full disabled:bg-dark-600 disabled:text-white bg-accent-300 text-black hover:bg-accent-200"
					>
						Sign In
					</PongButton>
					<Box height="20px" />
				</div>
			</div>
		</main>
	);
};

export default Tfa;
