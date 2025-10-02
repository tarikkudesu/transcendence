'use client';

import { Card, Flex, Text } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import SafeImage from '../../mini/SafeImage';
import { useUser } from '@/app/_service/user/userContext';
import { useUpdateAvatarCall } from '@/app/_service/auth/Fetchers';
import { useNotification } from '../../mini/useNotify';

const UpdateAvatar: React.FC = () => {
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
		}
		if (error) {
			notify({ message: error.message, error: true });
			reset();
		}
	}, [data, error, notify, reset]);

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Ready for a New Look?
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				Click to change. Supports jpg, jpeg, png, webp and .gif. Max file size: 4MB.
			</Text>
			<Card>
				<Flex justify="between" align="center" p="4" gap="9">
					<Card onClick={triggerFileSelect} className="flex justify-start items-start gap-4 p-4 flex-grow cursor-pointer">
						<SafeImage
							priority
							height={100}
							width={100}
							src={'/Logo.png'}
							alt="Logo as avatar"
							fallbackSrc="/Logo.png"
							className="rounded-full aspect-square object-cover"
							loader={() => (src ? src : avatar)}
						/>
						<div className="text-dark-300">
							Upload your avatar
							{file && (
								<ul className="mt-2 text-xs text-dark-400">
									<li>Name: {file.name}</li>
									<li>Type: {file.type}</li>
									<li>Size: {file.size} bytes</li>
								</ul>
							)}
						</div>
					</Card>
					<input
						id="file"
						type="file"
						accept="image/*"
						ref={fileInputRef}
						onChange={handleFileChange}
						style={{ display: 'none' }}
					/>
					<PongButton
						loading={isLoading}
						disabled={isLoading}
						onClick={() => {
							if (file) updateavatarcall({ avatar: file });
						}}
						className="bg-accent-300 hover:bg-accent-200 text-black disabled:bg-dark-600 disabled:text-dark-200"
					>
						Save
					</PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdateAvatar;
