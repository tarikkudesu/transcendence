'use client';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import Logo from '@/app/_components/mini/Logo';
import { useNotification } from '@/app/_components/mini/useNotify';
import client from '@/app/_service/axios/client';
import { PongError, MutateResponse, ForgotPasswordRequest } from '@/app/_service/schema';
import { Box, Text } from '@radix-ui/themes';
import { AxiosResponse, AxiosError } from 'axios';
import Link from 'next/link';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

function useForgotPasswordCall() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<MutateResponse | null>(null);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setIsLoading(false);
	}, []);

	const fetchData = useCallback(async (body: ForgotPasswordRequest) => {
		try {
			setIsLoading(true);
			const response: AxiosResponse<MutateResponse> = await client.post('/auth/forgot-password', body);
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

	return { isLoading, error, data, forgotpasscall: fetchData, reset };
}

const ForgotPassword: React.FC<unknown> = () => {
	const { notify } = useNotification();
	const [email, setEmail] = useState<string>('');
	const { forgotpasscall, data, error, isLoading, reset } = useForgotPasswordCall();

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			reset();
		}
		if (error) {
			notify({ message: error.message, error: true });
			reset();
		}
	}, [data, error, notify, reset]);

	return (
		<main>
			<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<Logo />
				<Box height="24px" />
				<div className="p-12 bg-dark-700 w-[400px] md:w-[500px] mx-auto rounded-lg">
					<Text as="div" mb="2" mt="4" weight="bold" size="6">
						Forgot your password?
					</Text>
					<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
						YingYangPong will email you instructions on how to reset it.
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
							type="email"
							name="email"
						></input>
					</label>
					<Box height="20px" />
					<PongButton
						loading={isLoading}
						disabled={!email}
						onClick={() => forgotpasscall({ email })}
						className="w-full disabled:bg-dark-600 disabled:text-white bg-accent-300 text-black hover:bg-accent-200"
					>
						Reset
					</PongButton>
					<Box height="20px" />
					<Link href="/login" className="text-sm text-accent-300">
						Return to Login
					</Link>
				</div>
			</div>
		</main>
	);
};

export default ForgotPassword;
