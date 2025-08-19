import SideProfile from '@/app/_components/dash/friends/SideProfile';
import Header from '@/app/_components/dash/Header';
import MiniNavigation from '@/app/_components/dash/MiniNavigation';
import MyDashboardProfile from '@/app/_components/dash/MyProfile';
import Navigation from '@/app/_components/dash/Navigation';
import GameProvider from '@/app/_service/ws/game/gameProvider';
import NotificationProvider from '@/app/_service/ws/notification/NotificationProvider';
import { Box } from '@radix-ui/themes';
import type { Metadata } from 'next';

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
		<div className="relative">
			<GameProvider>
				<NotificationProvider>
					<Header />
				</NotificationProvider>
				<div className="grid grid-cols-[250px_1fr] grid-rows-5 gap-2 mx-[50px] pt-[80px]">
					<div className="bg-dark-950 rounded-md row-span-5 p-4 shadow-xl">
						<MyDashboardProfile />
						<Box height="36px" />
						<Navigation />
						<Box height="180px" />
					</div>
					<div className="mt-[60px] p-4 row-span-5 rounded-md">
						<MiniNavigation />
						{children}
					</div>
				</div>
			</GameProvider>
		</div>
	);
}
