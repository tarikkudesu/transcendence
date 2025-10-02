'use client';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import Logo from '@/app/_components/mini/Logo';
import SafeImage from '@/app/_components/mini/SafeImage';
import { useNotification } from '@/app/_components/mini/useNotify';
import { useUpdateAvatarCall } from '@/app/_service/auth/Fetchers';
import { useUser } from '@/app/_service/user/userContext';
import { Box, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const AddProfilePicture: React.FC<unknown> = () => {
	const router = useRouter();
	const { avatar } = useUser();
	const { notify } = useNotification();
	const [src, setSrc] = useState<string>('');
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { data, isLoading, error, updateavatarcall, reset } = useUpdateAvatarCall();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
			const reader: FileReader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			reader.onload = () => {
				setSrc(typeof reader.result === 'string' ? reader.result : '');
			};
		}
	};

	const triggerFileSelect = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			reset();
			router.push('/add-bio');
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
						<div className="h-full w-1/2 bg-accent-300"></div>
					</div>
					<Text as="div" mb="4" mt="4" weight="bold" size="6">
						Complete Profile
					</Text>
					<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
						Present yourself in YingYangPong to other players by adding a profile picture.
					</Text>
					<Box height="12px" />
					<div
						onClick={triggerFileSelect}
						className="flex justify-center items-center bg-dark-600 rounded-full w-[120px] aspect-square mx-auto cursor-pointer"
					>
						<SafeImage
							priority
							width={100}
							height={100}
							src={'/Logo.png'}
							alt="Logo as avatar"
							fallbackSrc="/Logo.png"
							loader={() => (src ? src : avatar)}
							className="m-auto rounded-full aspect-square object-cover"
						/>
					</div>
					<Box height="12px" />
					<input
						id="file"
						type="file"
						accept="image/*"
						ref={fileInputRef}
						onChange={handleFileChange}
						style={{ display: 'none' }}
					/>
					<Box height="20px" />
					<PongButton
						loading={isLoading}
						disabled={isLoading}
						className="w-full disabled:bg-dark-600 disabled:text-white bg-accent-300 text-black hover:bg-accent-200"
						onClick={() => {
							if (file) updateavatarcall({ avatar: file });
						}}
					>
						Continue
					</PongButton>
					<Box height="20px" />
					<Link href="/add-bio">
						<PongButton className="w-full bg-dark-600 text-dark-200 hover:text-white hover:bg-dark-500">Skip</PongButton>
					</Link>
				</div>
			</div>
		</main>
	);
};

export default AddProfilePicture;
