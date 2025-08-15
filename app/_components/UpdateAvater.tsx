'use client';

import { Button, Card, Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';
import { RequestResult } from '../_service/auth/calls';
import { useAuth } from '../_service/AuthContext';
import { updateAvatar } from '../_service/user/calls';
import { useNotification } from './useNotify';

const UpdateAvatar: React.FC = () => {
	const { username } = useAuth();
	const { notify } = useNotification();
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
	};

	const updateAvatarCall = useCallback(async () => {
		if (!file) return;
		setIsLoading(true);
		const result: RequestResult = await updateAvatar(username, { avatar: file });
		if (result.message === 'success') {
			notify({ message: 'Success', success: true });
			setFile(null);
		} else notify({ message: result.message, error: true });
		setIsLoading(false);
	}, [file, notify, username]);

	const triggerFileSelect = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	return (
		<div className="my-[36px]">
			<Text as="div" mb="2" mt="4" weight="bold" size="5">
				Change your avatar
			</Text>
			<Text as="div" mb="4" mt="1" className="text-sm text-dark-200">
				We support .png .jpg .jpeg.
			</Text>
			<Card>
				<Flex justify="between" align="center" p="4" gap="9">
					<Card onClick={triggerFileSelect} className="flex justify-start items-start gap-4 p-4 flex-grow cursor-pointer">
						<Card>
							<Image priority src="/Logo.png" height={40} width={40} alt="Logo as avatar" />
						</Card>
						<Text as="div" weight="bold" size="1" className="text-white">
							Upload your avatar
							{file && (
								<ul className="mt-2 text-xs text-dark-200">
									<li>Name: {file.name}</li>
									<li>Type: {file.type}</li>
									<li>Size: {file.size} bytes</li>
								</ul>
							)}
						</Text>
					</Card>
					<input
						id="file"
						type="file"
						accept="image/*"
						ref={fileInputRef}
						onChange={handleFileChange}
						style={{ display: 'none' }}
					/>
					<Button
						size="3"
						color="gray"
						radius="small"
						variant="outline"
						disabled={!file || isLoading}
						className="px-4 text-center bg-accent-300 text-sm text-black disabled:bg-dark-600 disabled:text-dark-200"
						onClick={updateAvatarCall}
						loading={isLoading}
					>
						Save
					</Button>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdateAvatar;
