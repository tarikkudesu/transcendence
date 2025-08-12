import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Theme } from '@radix-ui/themes';
import { Toaster } from 'react-hot-toast';

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
			<body className="antialiased">
				<Theme appearance="dark" accentColor="lime" className={`${josefin.className} bg-dark-900 text-amber-50`}>
					<Toaster />
					<ul className="">
						<li>
							<Link href="/login">/login</Link>
						</li>
						<li>
							<Link href="/signup">/signup</Link>
						</li>
						<li>
							<Link href="/dash">/dash</Link>
						</li>
						<li>
							<Link href="/verify-account">/verify-account</Link>
						</li>
						<li>
							<Link href="/2fa-authentication">/2fa-authentication</Link>
						</li>
						<li>
							<Link href="/forgot-password">/forgot-password</Link>
						</li>
						<li>
							<Link href="/reset-password">/reset-password</Link>
						</li>
					</ul>
					{children}
				</Theme>
			</body>
		</html>
	);
}
