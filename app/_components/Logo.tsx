import { Flex, Text } from '@radix-ui/themes';
import React from 'react';
import Image from 'next/image';

const Logo: React.FC<unknown> = () => {
	return (
		<Flex justify="start" align="center" gap="4" className="h-[40px]">
			<Image src="/Logo.png" height={28} width={28} alt="Ying Yang Pong Logo"></Image>
			<Text weight="bold" size="4">
				YingYangPong
			</Text>
		</Flex>
	);
};

export default Logo;
