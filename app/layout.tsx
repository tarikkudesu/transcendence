import { Theme } from '@radix-ui/themes';
import type { Metadata, Viewport } from 'next';
import { Josefin_Sans } from 'next/font/google';

import AuthProvider from './_service/auth/authProvider';
import './globals.css';
import Background from './_components/Background';

const josefin = Josefin_Sans({
	subsets: ['latin'],
	display: 'swap',
});

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

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
		<html lang="en">
			<body className="antialiased m-0 p-0 bg-dark-900">
				<Theme
					panelBackground="translucent"
					appearance="dark"
					accentColor="lime"
					hasBackground={false}
					className={`${josefin.className} text-amber-50 m-0`}
				>
					<AuthProvider>{children}</AuthProvider>
				</Theme>
			</body>
		</html>
	);
}
