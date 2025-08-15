import { Theme } from '@radix-ui/themes';
import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const josefin = Josefin_Sans({
	subsets: ['latin'],
	display: 'swap',
});

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
			<meta name="viewport" content="width=1024" />
			<body className="antialiased m-0 p-0">
				<Theme
					panelBackground="translucent"
					appearance="dark"
					accentColor="lime"
					hasBackground={false}
					className={`${josefin.className} bg-dark-900 text-amber-50 m-0`}
				>
					<Toaster position="top-center" reverseOrder={false} />
					{children}
				</Theme>
			</body>
		</html>
	);
}
