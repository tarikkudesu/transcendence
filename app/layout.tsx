import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import './globals.css';
import { Theme } from '@radix-ui/themes';
import { Toaster } from 'react-hot-toast';
import { UserProfileProvider } from './_service/UserContextProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
			<body className="antialiased m-0 p-0">
				<Theme
					panelBackground="translucent"
					appearance="dark"
					accentColor="lime"
					hasBackground={false}
					className={`${josefin.className} bg-dark-900 text-amber-50 m-0`}
				>
					<Toaster position="bottom-right" reverseOrder={false} />
					<UserProfileProvider>{children}</UserProfileProvider>
				</Theme>
			</body>
		</html>
	);
}
