import { Box, Card, Link, Text } from '@radix-ui/themes';

import React from 'react';
import SafeImage from '../mini/SafeImage';

const PlayTournament: React.FC = () => {
	return (
		<>
			<Card className="relative overflow-hidden p-8 mb-[20px]">
				<div className="h-[350px] w-[350px] bg-magenta-500 rounded-full absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 blur-3xl opacity-45 -z-10"></div>
				<SafeImage
					fallbackSrc="/Logo.png"
					priority
					draggable={false}
					src="/Tournament.png"
					height={150}
					width={150}
					alt="Doom image"
					className="absolute top-2 right-2 -rotate-12"
				/>
				<Box height="60px" />
				<Text as="div" mb="2" mt="4" weight="bold" size="7" className="text-white">
					Play Ping Pong Tournament
				</Text>
				<Text as="div" mb="4" mt="1" className="text-sm text-dark-100">
					Basic details that will be a representation of yourself across the YingYangPong playground.
				</Text>
				<Box height="20px" />
				<Link href={`/tournament`}>
					<button className="py-3 px-4 text-center bg-magenta-500 text-xs text-white rounded-md cursor-pointer font-bold">
						Play Now
					</button>
				</Link>
			</Card>
		</>
	);
};

export default PlayTournament;
