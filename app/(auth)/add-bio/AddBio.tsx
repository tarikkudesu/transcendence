'use client';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import Logo from '@/app/_components/mini/Logo';
import { useNotification } from '@/app/_components/mini/useNotify';
import { useUpdateBioCall } from '@/app/_service/auth/Fetchers';
import client from '@/app/_service/axios/client';
import { UserProfile } from '@/app/_service/schema';
import { Box, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';

const AddBio: React.FC<unknown> = () => {
	const router = useRouter();
	const { notify } = useNotification();
	const [bio, setBio] = useState<string>('');
	const { data, error, isLoading, updatebiocall, reset } = useUpdateBioCall();
	const fetchData = (): Promise<UserProfile> => client.get(`/users/me`).then((response) => response.data);
	const { error: userError, isPending: userLoading } = useQuery({
		queryKey: ['usersme'],
		queryFn: fetchData,
	});

	useEffect(() => {
		if (userError) router.push('/login');
	}, [router, userError]);

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			reset();
			router.push('/');
		}
		if (error) {
			notify({ message: error.message, error: true });
			reset();
		}
	}, [data, error, notify, reset, router]);

	return (
		<main>
			<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<Logo />
				<Box height="24px" />
				<div className="p-12 bg-dark-700 w-[400px] md:w-[500px] mx-auto rounded-lg relative overflow-hidden">
					<div className="h-2 w-full absolute top-0 left-0 right-0">
						<div className="h-full w-full bg-accent-300"></div>
					</div>
					<Text as="div" mb="4" mt="4" weight="bold" size="6">
						Complete Profile
					</Text>
					<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
						Help YingYangPong players to know more about you by adding a Bio to your profile.
					</Text>
					<Box height="12px" />
					<label className="text-sm text-dark-200">
						Bio
						<textarea
							required
							minLength={4}
							maxLength={1000}
							value={bio}
							className="text-white w-full my-1 outline-none rounded-md p-3 text-sm border border-dark-500 bg-transparent resize-y h-40 min-h-20 max-h-60"
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
							name="bio"
						></textarea>
					</label>
					<Box height="20px" />
					<PongButton
						loading={isLoading || userLoading}
						disabled={isLoading || userLoading}
						onClick={() => updatebiocall({ bio })}
						className="w-full disabled:bg-dark-600 disabled:text-white bg-accent-300 text-black"
					>
						Continue
					</PongButton>
					<Box height="20px" />
					<Link href="">
						<PongButton className="w-full bg-dark-600 text-dark-200 hover:text-white hover:bg-dark-500">Skip</PongButton>
					</Link>
				</div>
			</div>
		</main>
	);
};

export default AddBio;
