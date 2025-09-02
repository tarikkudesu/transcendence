import { Flex, Text } from '@radix-ui/themes';

import Link from 'next/link';
import React from 'react';
import SafeImage from './SafeImage';

const Logo: React.FC<unknown> = () => {
	return (
		<Link href="/">
			<Flex justify="start" align="center" gap="4" className="h-[40px]">
				<SafeImage
					priority
					fallbackSrc="/Logo.png"
					src="/Logo.png"
					height={28}
					width={28}
					alt="Ying Yang Pong Logo"
					className="object-cover aspect-square"
				></SafeImage>
				<Text weight="bold" size="4">
					YingYangPong
				</Text>
			</Flex>
		</Link>
	);
};

export default Logo;
