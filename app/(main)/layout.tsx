'use client';

import FriendsProvider from '../_service/friends/FriendProvider';
import UserProvider from '../_service/user/userProvider';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="min-h-screen relative pb-[100px]">
			<UserProvider>
				<FriendsProvider>{children}</FriendsProvider>
			</UserProvider>
		</main>
	);
}
