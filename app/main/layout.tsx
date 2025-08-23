import type { Metadata } from 'next';
import AuthProvider from '../_service/AuthProvider';
import FriendsProvider from '../_service/friends/FriendProvider';

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
			<AuthProvider>
				<FriendsProvider>{children}</FriendsProvider>
			</AuthProvider>
		</main>
	);
}
