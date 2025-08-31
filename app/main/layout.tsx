'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FriendsProvider from '../_service/friends/FriendProvider';
import UserProvider from '../_service/user/userProvider';

const queryClient = new QueryClient();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="min-h-screen relative pb-[100px]">
			<QueryClientProvider client={queryClient}>
				<UserProvider>
					<FriendsProvider>{children}</FriendsProvider>
				</UserProvider>
			</QueryClientProvider>
		</main>
	);
}
