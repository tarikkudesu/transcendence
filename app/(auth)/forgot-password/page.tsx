'use client';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import Logo from '@/app/_components/mini/Logo';
import { useNotification } from '@/app/_components/mini/useNotify';
import { useForgotPasswordCall } from '@/app/_service/auth/Fetchers';
import { Box, Text } from '@radix-ui/themes';
import Link from 'next/link';
import React, { ChangeEvent, useEffect, useState } from 'react';

const ForgotPassword: React.FC<unknown> = () => {
	const { notify } = useNotification();
	const [email, setEmail] = useState<string>('');
	const { forgotpasscall, data, error, isLoading } = useForgotPasswordCall();

	useEffect(() => {
		if (data) notify({ message: data.message, success: true });
		if (error) notify({ message: error.message, error: true });
	}, [data, error, notify]);

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
