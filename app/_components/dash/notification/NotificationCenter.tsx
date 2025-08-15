'use client';

import { NotificationType } from '@/app/_service/ws/notification/notificationContext';
import { Badge, Link, ScrollArea, Separator, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { useState } from 'react';
import UserCallout from '../game/UserCallout';

const NotificationCenter = () => {
	// const { notifications } = useNotificationSocket();
	const [active, setActive] = useState<boolean>(false);
	const notifications: NotificationType[] = [
		{
			senderAvatarUrl: 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar17.png',
			reciever: 'reda',
			sender: 'ayoub',
			event: 'request',
			date: '2025-08-13T09:15:00.000Z',
		},
		{
			senderAvatarUrl: 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar13.png',
			reciever: 'khalid',
			sender: 'imane',
			event: 'request',
			date: '2025-08-12T14:30:00.000Z',
		},
		{
			senderAvatarUrl: 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar15.png',
			reciever: 'hamza',
			sender: 'fatima',
			event: 'request',
			date: '2025-08-11T19:45:00.000Z',
		},
		{
			senderAvatarUrl: 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar75.png',
			reciever: 'zineb',
			sender: 'youssef',
			event: 'request',
			date: '2025-08-10T11:05:00.000Z',
		},
		{
			senderAvatarUrl: 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar14.png',
			reciever: 'furina',
			sender: 'salma',
			event: 'request',
			date: '2025-08-09T08:20:00.000Z',
		},
	];

	return (
		<>
			{active && <div className="fixed top-0 left-0 bottom-0 right-0 z-10" onClick={() => setActive((state) => !state)}></div>}
			<button className="p-[4px] text-dark-200 hover:text-accent-300 relative z-[11]" onClick={() => setActive((state) => !state)}>
				{active && (
					<div className="p-5 rounded-md bg-dark-950 absolute top-0 right-0 translate-y-[28px] min-w-[380px] text-white shadow-lg">
						<Link href="">
							<Text as="div" size="2" align="right" mb="4" className="text-dark-200 hover:text-accent-300">
								See all notifications
							</Text>
						</Link>

						<ScrollArea type="always" scrollbars="vertical" style={{ height: 400 }}>
							<Separator size="4" />
							{notifications.length === 0 ? (
								<Text as="div" align="center" className="p-6">
									No notifications yet
								</Text>
							) : (
								notifications.map((notification, index) => (
									<div key={index}>
										<div className="px-4 py-2 bg-dark-800 hover:bg-dark-950 transition-colors">
											<div className="flex items-start">
												<div className="flex-1 min-w-0">
													<div className="flex items-center justify-between space-x-2 mb-1">
														<div className="flex">
															<UserCallout username={notification.sender}>
																<Image
																	priority
																	className="rounded-full cursor-pointer border-2 border-accent-300"
																	src={notification.senderAvatarUrl}
																	alt="player card"
																	width={18}
																	height={18}
																></Image>
															</UserCallout>
															<Text className="ml-4 text-sm font-medium ">{notification.sender}</Text>
														</div>
														<Text className="text-xs">{notification.date.slice(0, 10)}</Text>
													</div>
													<Text as="div" className="text-sm mb-2">
														{notification.event}
													</Text>
												</div>
											</div>
										</div>
										<Separator size="4" />
									</div>
								))
							)}
						</ScrollArea>
					</div>
				)}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={24} width={24}>
					<path
						fill="currentColor"
						d="M155.8 96C123.9 96 96.9 119.4 92.4 150.9L64.6 345.2C64.2 348.2 64 351.2 64 354.3L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 354.3C576 351.3 575.8 348.2 575.4 345.2L547.6 150.9C543.1 119.4 516.1 96 484.2 96L155.8 96zM155.8 160L484.3 160L511.7 352L451.8 352C439.7 352 428.6 358.8 423.2 369.7L408.9 398.3C403.5 409.1 392.4 416 380.3 416L259.9 416C247.8 416 236.7 409.2 231.3 398.3L217 369.7C211.6 358.9 200.5 352 188.4 352L128.3 352L155.8 160z"
					/>
				</svg>
				{notifications.length !== 0 && (
					<Badge size="1" radius="full" variant="solid" className="absolute top-0 right-0 scale-75" color="red">
						{notifications.length}
					</Badge>
				)}
			</button>
		</>
	);
};

export default NotificationCenter;
