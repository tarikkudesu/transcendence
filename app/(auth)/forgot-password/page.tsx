'use client';

import Logo from '@/app/_components/mini/Logo';
import { useNotification } from '@/app/_components/mini/useNotify';
import { forgotPassword, RequestResult } from '@/app/_service/auth/calls';
import { Box, Button, Text } from '@radix-ui/themes';
import Link from 'next/link';
import React, { ChangeEvent, useCallback, useState } from 'react';

const ForgotPassword: React.FC<unknown> = () => {
	const [email, setEmail] = useState<string>('');

	const { notify } = useNotification();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const verifyCall = useCallback(async () => {
		if (!email) return;
		setIsLoading(true);
		const result: RequestResult = await forgotPassword({ email });
		if (result.message === 'success') {
			notify({ message: 'Success', success: true });
		} else notify({ message: result.message, error: true });
		setIsLoading(false);
	}, [email, notify]);

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
						YingYangPong has emailed you instructions on how to reset it.
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
					<Box height="20px" />
					<Button
						radius="small"
						size="3"
						disabled={!email}
						className="w-full p-2.5 disabled:bg-dark-600 bg-accent-300 text-center"
						onClick={verifyCall}
						loading={isLoading}
					>
						Verify
					</Button>
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
