'use client';

import { Card, Flex, Text } from '@radix-ui/themes';
import { useCallback, useRef, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import SafeImage from '../../mini/SafeImage';
import { useUser } from '@/app/_service/user/userContext';

const UpdateAvatar: React.FC = () => {
	const { avatar } = useUser();
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
	};

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
							<SafeImage
								priority
								src={avatar}
								height={40}
								width={40}
								alt="Logo as avatar"
								fallbackSrc="/Logo.png"
								className="rounded-full"
							/>
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
					<PongButton className="bg-accent-300 hover:bg-accent-200 text-black disabled:bg-dark-600 disabled:text-dark-200">
						Save
					</PongButton>
				</Flex>
			</Card>
		</div>
	);
};

export default UpdateAvatar;
