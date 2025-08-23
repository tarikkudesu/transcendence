import { Box, Card, Text } from '@radix-ui/themes';

import Link from 'next/link';
import React from 'react';
import SafeImage from '../mini/SafeImage';

const PlayPong: React.FC = () => {
	return (
		<>
			<Card className="relative overflow-hidden p-8 mb-[20px]">
				<div className="h-[350px] w-[350px] bg-accent-300 rounded-full absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 blur-3xl opacity-45 -z-10"></div>
				<SafeImage
					fallbackSrc="/Logo.png"
					priority
					draggable={false}
					src="/Logo.png"
					height={150}
					width={150}
					alt="Doom image"
					className="absolute top-2 right-2 -rotate-12"
				/>
				<Box height="60px" />
				<Text as="div" mb="2" mt="4" weight="bold" size="7" className="text-white">
					Play Ping Pong Remote
				</Text>
				<Text as="div" mb="4" mt="1" className="text-sm text-dark-100">
					Basic details that will be a representation of yourself across the YingYangPong playground.
				</Text>
				<Box height="20px" />
				<Link href={`/main/dashboard/playground`}>
					<button className="py-3 px-4 text-center bg-accent-300 text-xs text-black rounded-md cursor-pointer font-bold">
						Play Now
					</button>
				</Link>
			</Card>
		</>
	);
};

export default PlayPong;
