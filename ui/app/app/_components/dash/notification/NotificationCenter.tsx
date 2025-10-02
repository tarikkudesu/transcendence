'use client';

import { NotificationType, useNotificationSocket } from '@/app/_service/ws/notification/notificationContext';
import { Badge, ScrollArea, Text } from '@radix-ui/themes';

import { useFriends } from '@/app/_service/friends/FriendContext';
import { ReadMessage } from '@/app/_service/ws/notification/composer';
import { SvgChat, SvgFriend, SvgInbox, SvgPong, SvgTrash, SvgTrophy } from '@/app/_svg/svg';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';

const NotificationCenter = () => {
	const router = useRouter();
	const { notifications, send } = useNotificationSocket();
	const { refetch } = useFriends();
	const [active, setActive] = useState<boolean>(false);

	const getNotificationTitle = useCallback(
		(
			event:
				| 'NEWTOURNAMENTDATE'
				| 'REGESTRATIONOPEN'
				| 'TOURNAMENTMATCHUP'
				| 'TOURNAMENTWON'
				| 'FRIENDACCEPTEDYOURREQUEST'
				| 'CHATMESSAGE'
				| 'FRIENDREQUEST'
		): string => {
			switch (event) {
				case 'CHATMESSAGE':
					return 'New Message';
				case 'FRIENDACCEPTEDYOURREQUEST':
					return 'Friend Request Accepted';
				case 'NEWTOURNAMENTDATE':
					return 'Next Tournament';
				case 'REGESTRATIONOPEN':
					return 'Registration Open';
				case 'TOURNAMENTMATCHUP':
					return "You're Up Next";
				case 'TOURNAMENTWON':
					return 'You Won!';
			}
			return '';
		},
		[]
	);
	const getNotificationMessage = useCallback(
		(
			sender: string,
			event:
				| 'NEWTOURNAMENTDATE'
				| 'REGESTRATIONOPEN'
				| 'TOURNAMENTMATCHUP'
				| 'TOURNAMENTWON'
				| 'FRIENDACCEPTEDYOURREQUEST'
				| 'CHATMESSAGE'
				| 'FRIENDREQUEST'
		): string => {
			switch (event) {
				case 'CHATMESSAGE':
					return `${sender} sent you a new message.`;
				case 'FRIENDACCEPTEDYOURREQUEST':
					return `${sender} accepted your friend request.`;
				case 'NEWTOURNAMENTDATE':
					return 'New tournament is now available, check the tournament tab.';
				case 'REGESTRATIONOPEN':
					return 'Take your place in the next tournament, registration is now open.';
				case 'TOURNAMENTMATCHUP':
					return "Get ready, you're up next.";
				case 'TOURNAMENTWON':
					return 'Congratulations on winning the tournament, Keep up the good work.';
			}
			return '';
		},
		[]
	);
	const getNotificationIcon = useCallback(
		(
			event:
				| 'NEWTOURNAMENTDATE'
				| 'REGESTRATIONOPEN'
				| 'TOURNAMENTMATCHUP'
				| 'TOURNAMENTWON'
				| 'FRIENDACCEPTEDYOURREQUEST'
				| 'CHATMESSAGE'
				| 'FRIENDREQUEST'
		): React.ReactNode => {
			switch (event) {
				case 'CHATMESSAGE':
					return <SvgChat size={18} />;
				case 'FRIENDACCEPTEDYOURREQUEST':
					return <SvgFriend size={18} />;
				case 'NEWTOURNAMENTDATE':
					return <SvgTrophy size={18} />;
				case 'REGESTRATIONOPEN':
					return <SvgTrophy size={18} />;
				case 'TOURNAMENTMATCHUP':
					return <SvgPong size={18} />;
				case 'TOURNAMENTWON':
					return <SvgTrophy size={18} />;
			}
			return null;
		},
		[]
	);
	const getNotificationAction = useCallback(
		(
			sender: string,
			id: number,
			event:
				| 'NEWTOURNAMENTDATE'
				| 'REGESTRATIONOPEN'
				| 'TOURNAMENTMATCHUP'
				| 'TOURNAMENTWON'
				| 'FRIENDACCEPTEDYOURREQUEST'
				| 'CHATMESSAGE'
				| 'FRIENDREQUEST'
		): React.ReactNode => {
			switch (event) {
				case 'CHATMESSAGE':
					return (
						<div className="flex gap-2 mt-2">
							<PongButton
								className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm"
								onClick={() => {
									setActive(false);
									send(ReadMessage(id));
									router.push(`/chat?chatemate=${sender}`);
								}}
							>
								Reply
							</PongButton>
						</div>
					);
				case 'FRIENDACCEPTEDYOURREQUEST':
					return (
						<div className="flex gap-2 mt-2">
							<PongButton
								className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm"
								onClick={() => {
									refetch();
									send(ReadMessage(id));
									router.push(`/profile/${sender}`);
								}}
							>
								Check Out
							</PongButton>
						</div>
					);
				case 'NEWTOURNAMENTDATE':
					return <></>;
				case 'REGESTRATIONOPEN':
					return (
						<div className="flex gap-2 mt-2">
							<PongButton
								className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm"
								onClick={() => {
									setActive(false);
									send(ReadMessage(id));
									router.push('/tournament');
								}}
							>
								Check Out
							</PongButton>
						</div>
					);
				case 'TOURNAMENTMATCHUP':
					return (
						<div className="flex gap-2 mt-2">
							<PongButton
								className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm"
								onClick={() => {
									setActive(false);
									send(ReadMessage(id));
									router.push('/tournament');
								}}
							>
								Check Out
							</PongButton>
						</div>
					);
				case 'TOURNAMENTWON':
					return <></>;
			}
			return null;
		},
		[refetch, router, send]
	);

	const filterNotifications = useCallback((notification: NotificationType): boolean => {
		if (notification.event !== 'FRIENDREQUEST') return true;
		return false;
	}, []);

	return (
		<>
			{active && <div className="fixed top-0 left-0 bottom-0 right-0 z-10" onClick={() => setActive(false)}></div>}
			<div className="p-[4px] text-dark-200 hover:text-accent-300 relative" onClick={() => setActive(true)}>
				{active && (
					<div className="p-2 rounded-md bg-dark-950 absolute top-0 right-0 translate-y-[60px] w-[420px] text-white shadow-xl z-10 border border-dark-500">
						<ScrollArea type="hover" scrollbars="vertical" style={{ height: 600 }} className="pr-1">
							{notifications.length === 0 && (
								<Text as="div" align="center" className="p-6">
									No notifications yet
								</Text>
							)}
							{notifications.filter(filterNotifications).map((notification, index) => {
								return (
									<div key={index} className="bg-dark-700 rounded-md border-l-4 border-l-accent-300 mb-2 p-3 relative">
										<div className="flex justify-start">
											<div className="bg-slate-600 rounded-md aspect-square p-1 h-[32px] w-[32px] flex justify-center items-center mr-4">
												{getNotificationIcon(notification.event)}
											</div>
											<div className="text-left">
												<Text as="div" className="text-md text-dark-50 font-bold mb-1">
													{getNotificationTitle(notification.event)}{' '}
												</Text>
												<Text as="div" className="text-sm text-dark-200 mb-1">
													{getNotificationMessage(notification.sender, notification.event)}
												</Text>
												<Text as="div" className="text-xs text-dark-300">
													{formatDistanceToNow(Number(notification.date), { addSuffix: true })}
												</Text>
											</div>
											<div className="" onClick={() => send(ReadMessage(notification.id))}>
												<SvgTrash
													size={24}
													className="p-1 rounded-md text-dark-200 hover:text-red-600 absolute top-3 right-3 cursor-pointer"
												/>
											</div>
										</div>
										{getNotificationAction(notification.sender, notification.id, notification.event)}
									</div>
								);
							})}
						</ScrollArea>
					</div>
				)}
				<SvgInbox size={24} className="cursor-pointer" />
				{notifications.filter(filterNotifications).length !== 0 && (
					<Badge size="1" radius="full" variant="solid" className="absolute top-0 right-0 scale-75 font-black" color="red">
						{notifications.filter(filterNotifications).length}
					</Badge>
				)}
			</div>
		</>
	);
};

export default NotificationCenter;
