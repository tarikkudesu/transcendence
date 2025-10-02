import { Box, Flex, Text } from '@radix-ui/themes';
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = ({}) => {
	return (
		<footer className="h-[80px] absolute right-0 left-0 bottom-0">
			<Flex justify="center" align="center" gap="9" height="80px" mx="100px">
				<Logo />
				<Text>© 2025 YingYangPong. All rights reserved.</Text>
				<Box />
			</Flex>
		</footer>
	);
};

export default Footer;
