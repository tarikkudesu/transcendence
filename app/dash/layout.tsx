import { Box, Flex, Text } from '@radix-ui/themes';
import type { Metadata } from 'next';
import Logo from '../_components/Logo';

export const metadata: Metadata = {
	title: 'YingYangPong',
	description: '',
	icons: {
		icon: '/favicon.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="min-h-screen relative pb-[100px]">
			<header>
				<Flex justify="between" align="center" height="80px" mx="100px">
					<Logo />
					<button className="py-3 px-4 text-center bg-dark-700 text-xs text-dark-200 hover:text-white hover:bg-dark-600 rounded-sm cursor-pointer font-bold">
						Log Out
					</button>
				</Flex>
			</header>
			<div>{children}</div>
			<footer className="h-[80px] absolute right-0 left-0 bottom-0">
				<Flex justify="center" align="center" gap="9" height="80px" mx="100px">
					<Logo />
					<Text>Copyright reseved</Text>
					<Box />
				</Flex>
			</footer>
		</main>
	);
}
