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
			<head>
				<meta name="viewport" content="width=1200, initial-scale=0.5, minimum-scale=0.1, maximum-scale=2.0, user-scalable=yes" />
			</head>
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
