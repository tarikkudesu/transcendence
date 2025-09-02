'use client';

import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Josefin_Sans } from 'next/font/google';
import './globals.css';

const josefin = Josefin_Sans({
	subsets: ['latin'],
});

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: 1 } },
});

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
					<QueryClientProvider client={queryClient}>
						<div className={josefin.className}>{children}</div>
					</QueryClientProvider>
				</Theme>
			</body>
		</html>
	);
}
