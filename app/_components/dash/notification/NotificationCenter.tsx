'use client';

import { useNotificationSocket } from '@/app/_service/ws/notification/notificationContext';
import { Badge, ScrollArea, Text } from '@radix-ui/themes';

import { AcceptMessage, DeleteMessage, RejectMessage, useGameSocket } from '@/app/_service/ws/game';
import { SvgAddFriend, SvgChat, SvgDoom, SvgFriend, SvgPong, SvgTrophy } from '@/app/_svg/svg';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';

const NotificationCenter = () => {
	const { send, invitations } = useGameSocket();
	const { notifications } = useNotificationSocket();
	const [active, setActive] = useState<boolean>(false);

	const getNotificationTitle = (
		event:
			| 'NEWTOURNAMENTDATE'
			| 'REGESTRATIONOPEN'
			| 'TOURNAMENTMATCHUP'
			| 'TOURNAMENTWON'
			| 'PONGGAMEINVITATION'
			| 'DOOMGAMEINVITATION'
			| 'FRIENDREQUEST'
			| 'FRIENDACCEPTEDYOURREQUEST'
			| 'CHATMESSAGE'
	): string => {
		switch (event) {
			case 'CHATMESSAGE':
				return 'New Message';
			case 'DOOMGAMEINVITATION':
				return 'Doom Invitation';
			case 'FRIENDACCEPTEDYOURREQUEST':
				return 'Friend Request Accepted';
			case 'FRIENDREQUEST':
				return 'New Friend Request';
			case 'NEWTOURNAMENTDATE':
				return 'Next Tournament';
			case 'PONGGAMEINVITATION':
				return 'Pong Invitation';
			case 'REGESTRATIONOPEN':
				return 'Registration Open';
			case 'TOURNAMENTMATCHUP':
				return "You're Up Next";
			case 'TOURNAMENTWON':
				return 'You Won!';
		}
	};
	const getNotificationMessage = (
		sender: string,
		event:
			| 'NEWTOURNAMENTDATE'
			| 'REGESTRATIONOPEN'
			| 'TOURNAMENTMATCHUP'
			| 'TOURNAMENTWON'
			| 'PONGGAMEINVITATION'
			| 'DOOMGAMEINVITATION'
			| 'FRIENDREQUEST'
			| 'FRIENDACCEPTEDYOURREQUEST'
			| 'CHATMESSAGE'
	): string => {
		switch (event) {
			case 'CHATMESSAGE':
				return `${sender} sent you a new message.`;
			case 'DOOMGAMEINVITATION':
				return `${sender} challenged you to a Doom match.`;
			case 'FRIENDACCEPTEDYOURREQUEST':
				return `${sender} accepted your friend request.`;
			case 'FRIENDREQUEST':
				return `${sender} sent you a friend request.`;
			case 'NEWTOURNAMENTDATE':
				return 'New tournament is now available, check the tournament tab.';
			case 'PONGGAMEINVITATION':
				return `${sender} challenged you to a Ping Pong match.`;
			case 'REGESTRATIONOPEN':
				return 'Take your place in the next tournament, registration is now open.';
			case 'TOURNAMENTMATCHUP':
				return "Get ready, you're up next.";
			case 'TOURNAMENTWON':
				return 'Congratulations on winning the tournament, Keep up the good work.';
		}
	};
	const getNotificationIcon = (
		event:
			| 'NEWTOURNAMENTDATE'
			| 'REGESTRATIONOPEN'
			| 'TOURNAMENTMATCHUP'
			| 'TOURNAMENTWON'
			| 'PONGGAMEINVITATION'
			| 'DOOMGAMEINVITATION'
			| 'FRIENDREQUEST'
			| 'FRIENDACCEPTEDYOURREQUEST'
			| 'CHATMESSAGE'
	): React.ReactNode => {
		switch (event) {
			case 'CHATMESSAGE':
				return <SvgChat size={18} />;
			case 'DOOMGAMEINVITATION':
				return <SvgDoom size={18} />;
			case 'FRIENDACCEPTEDYOURREQUEST':
				return <SvgFriend size={18} />;
			case 'FRIENDREQUEST':
				return <SvgAddFriend size={18} />;
			case 'NEWTOURNAMENTDATE':
				return <SvgTrophy size={18} />;
			case 'PONGGAMEINVITATION':
				return <SvgPong size={18} />;
			case 'REGESTRATIONOPEN':
				return <SvgTrophy size={18} />;
			case 'TOURNAMENTMATCHUP':
				return <SvgPong size={18} />;
			case 'TOURNAMENTWON':
				return <SvgTrophy size={18} />;
		}
	};
	const getNotificationAction = (
		sender: string,
		event:
			| 'NEWTOURNAMENTDATE'
			| 'REGESTRATIONOPEN'
			| 'TOURNAMENTMATCHUP'
			| 'TOURNAMENTWON'
			| 'PONGGAMEINVITATION'
			| 'DOOMGAMEINVITATION'
			| 'FRIENDREQUEST'
			| 'FRIENDACCEPTEDYOURREQUEST'
			| 'CHATMESSAGE',
		status?: 'unsent' | 'pending' | 'accepted' | 'declined'
	): React.ReactNode => {
		switch (event) {
			case 'CHATMESSAGE':
				return (
					<div className="flex gap-2 mt-2">
						<PongButton className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm" onClick={() => confirm}>
							Reply
						</PongButton>
					</div>
				);
			case 'DOOMGAMEINVITATION':
				return (
					<div className="flex gap-2 mt-2">
						{status === 'pending' ? (
							<>
								<PongButton
									className="w-full bg-dark-950 hover:bg-red-400 hover:text-black text-sm"
									onClick={() => send(RejectMessage('card of doom', sender))}
								>
									Reject
								</PongButton>
								<PongButton
									className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm"
									onClick={() => send(AcceptMessage('card of doom', sender))}
								>
									Accept
								</PongButton>
							</>
						) : (
							<PongButton
								className="w-full bg-dark-950 hover:bg-red-500 hover:text-black text-sm"
								onClick={() => send(DeleteMessage('card of doom', sender))}
							>
								Delete
							</PongButton>
						)}
					</div>
				);
			case 'FRIENDACCEPTEDYOURREQUEST':
				return <></>;
			case 'FRIENDREQUEST':
				return (
					<div className="flex gap-2 mt-2">
						<PongButton className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm" onClick={() => confirm}>
							Go
						</PongButton>
					</div>
				);
			case 'NEWTOURNAMENTDATE':
				return <></>;
			case 'PONGGAMEINVITATION':
				return (
					<div className="flex gap-2 mt-2">
						{status === 'pending' ? (
							<>
								<PongButton
									className="w-full bg-dark-950 hover:bg-red-400 hover:text-black text-sm"
									onClick={() => send(RejectMessage('pong', sender))}
								>
									Reject
								</PongButton>
								<PongButton
									className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm"
									onClick={() => send(AcceptMessage('pong', sender))}
								>
									Accept
								</PongButton>
							</>
						) : (
							<PongButton
								className="w-full bg-dark-950 hover:bg-red-500 hover:text-black text-sm"
								onClick={() => send(DeleteMessage('pong', sender))}
							>
								Delete
							</PongButton>
						)}
					</div>
				);
			case 'REGESTRATIONOPEN':
				return (
					<div className="flex gap-2 mt-2">
						<PongButton className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm" onClick={() => confirm}>
							Go
						</PongButton>
					</div>
				);
			case 'TOURNAMENTMATCHUP':
				return (
					<div className="flex gap-2 mt-2">
						<PongButton className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm" onClick={() => confirm}>
							Go
						</PongButton>
					</div>
				);
			case 'TOURNAMENTWON':
				return <></>;
		}
	};

	return (
		<>
			{active && <div className="fixed top-0 left-0 bottom-0 right-0" onClick={() => setActive(false)}></div>}
			<div className="p-[4px] text-dark-200 hover:text-accent-300 relative" onClick={() => setActive(true)}>
				{active && (
					<div className="p-2 rounded-md bg-dark-950 absolute top-0 right-0 translate-y-[60px] w-[420px] text-white shadow-xl z-10 border border-dark-500">
						<ScrollArea type="always" scrollbars="vertical" style={{ height: 600 }} className="pr-1">
							{invitations.length + notifications.length === 0 && (
								<Text as="div" align="center" className="p-6">
									No notifications yet
								</Text>
							)}
							{invitations.map((invite, index) => (
								<div key={index} className="bg-dark-700 rounded-md border-l-4 border-l-accent-300 mb-2 p-3">
									<div className="flex justify-start">
										<div className="bg-slate-600 rounded-md aspect-square p-1 h-[32px] w-[32px] flex justify-center items-center mr-4">
											{getNotificationIcon(invite.game === 'pong' ? 'PONGGAMEINVITATION' : 'DOOMGAMEINVITATION')}
										</div>
										<div className="text-left">
											<Text as="div" className="text-md text-dark-50 font-bold mb-1">
												{getNotificationTitle(invite.game === 'pong' ? 'PONGGAMEINVITATION' : 'DOOMGAMEINVITATION')}{' '}
											</Text>
											<Text as="div" className="text-sm text-dark-200 mb-1">
												{getNotificationMessage(
													invite.sender,
													invite.game === 'pong' ? 'PONGGAMEINVITATION' : 'DOOMGAMEINVITATION'
												)}
											</Text>
											<Text as="div" className="text-xs text-dark-300">
												{formatDistanceToNow(Date.now(), { addSuffix: true })}
											</Text>
										</div>
									</div>
									{getNotificationAction(
										invite.sender,
										invite.game === 'pong' ? 'PONGGAMEINVITATION' : 'DOOMGAMEINVITATION',
										invite.inviteStatus
									)}
								</div>
							))}
							{notifications.map((notification, index) => {
								return (
									<div key={index} className="bg-dark-700 rounded-md border-l-4 border-l-accent-300 mb-2 p-3">
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
										</div>
										{getNotificationAction(notification.sender, notification.event)}
									</div>
								);
							})}
						</ScrollArea>
					</div>
				)}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={24} width={24}>
					<path
						fill="currentColor"
						d="M155.8 96C123.9 96 96.9 119.4 92.4 150.9L64.6 345.2C64.2 348.2 64 351.2 64 354.3L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 354.3C576 351.3 575.8 348.2 575.4 345.2L547.6 150.9C543.1 119.4 516.1 96 484.2 96L155.8 96zM155.8 160L484.3 160L511.7 352L451.8 352C439.7 352 428.6 358.8 423.2 369.7L408.9 398.3C403.5 409.1 392.4 416 380.3 416L259.9 416C247.8 416 236.7 409.2 231.3 398.3L217 369.7C211.6 358.9 200.5 352 188.4 352L128.3 352L155.8 160z"
					/>
				</svg>
				{invitations.length + notifications.length !== 0 && (
					<Badge size="1" radius="full" variant="solid" className="absolute top-0 right-0 scale-75" color="red">
						{invitations.length + notifications.length}
					</Badge>
				)}
			</div>
		</>
	);
};

export default NotificationCenter;
