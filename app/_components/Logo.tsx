import { Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Logo: React.FC<unknown> = () => {
	return (
		<Link href="/dash">
			<Flex justify="start" align="center" gap="4" className="h-[40px]">
				<Image priority src="/Logo.png" height={28} width={28} alt="Ying Yang Pong Logo"></Image>
				<Text weight="bold" size="4">
					YingYangPong
				</Text>
			</Flex>
		</Link>
	);
};

export default Logo;
