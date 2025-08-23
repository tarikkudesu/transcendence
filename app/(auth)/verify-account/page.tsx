'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import Logo from '@/app/_components/mini/Logo';
import { useNotification } from '@/app/_components/mini/useNotify';
import { RequestResult, resendOtp, verifyAccount } from '@/app/_service/auth/calls';
import { Box, Button, Text } from '@radix-ui/themes';

const SignUpVerify: React.FC<unknown> = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [email, setEmail] = useState<string>('');
	const [code, setCode] = useState<string>('');

	useEffect(() => {
		const mail: string | null = searchParams.get('email');
		if (!mail) {
			router.push('/login');
			return;
		}
		setEmail(mail);
	}, [router, searchParams]);

	const { notify } = useNotification();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const verifyCall = useCallback(async () => {
		if (!code || !email) return;
		setIsLoading(true);
		const result: RequestResult = await verifyAccount({ email, verificationCode: code });
		if (result.message === 'success') {
			notify({ message: 'Success', success: true });
			router.push(`2fa-authentication?email=${result.result?.email ?? ''}`);
		} else notify({ message: result.message, error: true });
		setIsLoading(false);
	}, [code, email, notify, router]);

	const resendCall = useCallback(async () => {
		setIsLoading(true);
		const result: RequestResult = await resendOtp({ email });
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
						Verify your YingYangPong account
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
					<button onClick={resendCall} className="text-sm text-dark-200 hover:text-accent-300">
						resend code?
					</button>
					<Box height="20px" />
					<Button
						radius="small"
						size="3"
						disabled={!code || !email || code.length !== 6}
						className="w-full p-2.5 disabled:bg-dark-600 bg-accent-300 text-center"
						onClick={verifyCall}
						loading={isLoading}
					>
						Verify
					</Button>
					<Box height="20px" />
				</div>
			</div>
		</main>
	);
};

export default SignUpVerify;
