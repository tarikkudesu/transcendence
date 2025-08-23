'use client';

import { Badge, ScrollArea, Text } from '@radix-ui/themes';

import { AcceptMessage, DeleteMessage, RejectMessage, useGameSocket } from '@/app/_service/ws/game';
import { SvgDoom, SvgGameBoy, SvgPong, SvgTrash } from '@/app/_svg/svg';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';

const GameInviteCenter = () => {
	const { send, invitations } = useGameSocket();
	const [active, setActive] = useState<boolean>(false);

	const getNotificationTitle = (event: 'PONGGAMEINVITATION' | 'DOOMGAMEINVITATION'): string => {
		switch (event) {
			case 'DOOMGAMEINVITATION':
				return 'Doom Invitation';
			case 'PONGGAMEINVITATION':
				return 'Pong Invitation';
		}
	};
	const getNotificationMessage = (sender: string, event: 'PONGGAMEINVITATION' | 'DOOMGAMEINVITATION'): string => {
		switch (event) {
			case 'DOOMGAMEINVITATION':
				return `${sender} challenged you to a Doom match.`;
			case 'PONGGAMEINVITATION':
				return `${sender} challenged you to a Ping Pong match.`;
		}
	};
	const getNotificationIcon = (event: 'PONGGAMEINVITATION' | 'DOOMGAMEINVITATION'): React.ReactNode => {
		switch (event) {
			case 'DOOMGAMEINVITATION':
				return <SvgDoom size={18} />;
			case 'PONGGAMEINVITATION':
				return <SvgPong size={18} />;
		}
	};
	const getNotificationAction = (
		sender: string,
		event: 'PONGGAMEINVITATION' | 'DOOMGAMEINVITATION',
		status?: 'unsent' | 'pending' | 'accepted' | 'declined'
	): React.ReactNode => {
		switch (event) {
			case 'DOOMGAMEINVITATION':
				return (
					<div className="flex gap-2 mt-2">
						{status === 'pending' ? (
							<>
								<PongButton
									className="w-full bg-dark-950 hover:bg-red-400 hover:text-black text-sm"
									onClick={() => {
										setActive(false);
										send(RejectMessage('card of doom', sender));
									}}
								>
									Reject
								</PongButton>
								<PongButton
									className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm"
									onClick={() => {
										setActive(false);
										send(AcceptMessage('card of doom', sender));
									}}
								>
									Accept
								</PongButton>
							</>
						) : (
							<PongButton
								className="w-full bg-dark-950 hover:bg-red-500 hover:text-black text-sm"
								onClick={() => {
									setActive(false);
									send(DeleteMessage('card of doom', sender));
								}}
							>
								Delete
							</PongButton>
						)}
					</div>
				);
			case 'PONGGAMEINVITATION':
				return (
					<div className="flex gap-2 mt-2">
						{status === 'pending' ? (
							<>
								<PongButton
									className="w-full bg-dark-950 hover:bg-red-400 hover:text-black text-sm"
									onClick={() => {
										setActive(false);
										send(RejectMessage('pong', sender));
									}}
								>
									Reject
								</PongButton>
								<PongButton
									className="w-full bg-dark-950 hover:bg-accent-300 hover:text-black text-sm"
									onClick={() => {
										setActive(false);
										send(AcceptMessage('pong', sender));
									}}
								>
									Accept
								</PongButton>
							</>
						) : (
							<PongButton
								className="w-full bg-dark-950 hover:bg-red-500 hover:text-black text-sm"
								onClick={() => {
									setActive(false);
									send(DeleteMessage('pong', sender));
								}}
							>
								Delete
							</PongButton>
						)}
					</div>
				);
		}
	};

	return (
		<>
			{active && <div className="fixed top-0 left-0 bottom-0 right-0 z-10" onClick={() => setActive(false)}></div>}
			<div className="p-[4px] text-dark-200 hover:text-accent-300 relative" onClick={() => setActive(true)}>
				{active && (
					<div className="p-2 rounded-md bg-dark-950 absolute top-0 right-0 translate-y-[60px] w-[420px] text-white shadow-xl z-10 border border-dark-500">
						<ScrollArea type="hover" scrollbars="vertical" style={{ height: 600 }} className="pr-1">
							{invitations.length === 0 && (
								<Text as="div" align="center" className="p-6">
									No invites yet
								</Text>
							)}
							{invitations.map((invite, index) => (
								<div key={index} className="bg-dark-700 rounded-md border-l-4 border-l-accent-300 mb-2 p-3 relative">
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
										<div className="" onClick={() => send(DeleteMessage(invite.game, invite.sender))}>
											<SvgTrash
												size={24}
												className="p-1 rounded-md text-dark-200 hover:text-red-500 absolute top-3 right-3 cursor-pointer"
											/>
										</div>
									</div>
									{getNotificationAction(
										invite.sender,
										invite.game === 'pong' ? 'PONGGAMEINVITATION' : 'DOOMGAMEINVITATION',
										invite.inviteStatus
									)}
								</div>
							))}
						</ScrollArea>
					</div>
				)}
				<SvgGameBoy size={24} className="cursor-pointer" />
				{invitations.length !== 0 && (
					<Badge size="1" radius="full" variant="solid" className="absolute top-0 right-0 scale-75 font-black" color="red">
						{invitations.length}
					</Badge>
				)}
			</div>
		</>
	);
};

export default GameInviteCenter;
