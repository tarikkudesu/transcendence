import ChatProvider from '@/app/_service/ws/chat/chatProvider';
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
			<ChatProvider>{children}</ChatProvider>
		</div>
	);
}
