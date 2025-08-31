import { Theme } from '@radix-ui/themes';
import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import './globals.css';

const josefin = Josefin_Sans({
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'YingYangPong',
	description: 'The perfect place to play',
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
		<html lang="en">
			<body className="antialiased m-0 p-0 bg-dark-900">
				<Theme
					panelBackground="translucent"
					appearance="dark"
					accentColor="lime"
					hasBackground={false}
					className={`${josefin.className} text-amber-50 m-0`}
				>
					{children}
				</Theme>
			</body>
		</html>
	);
}
