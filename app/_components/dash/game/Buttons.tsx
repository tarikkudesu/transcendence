'use client';

import { AcceptMessage, ClientInvitation, ClientPlayer, InviteMessage, RejectMessage, useGameSocket } from '@/app/_service/ws/game';
import { Spinner } from '@radix-ui/themes';
import React from 'react';

export const ChallangePong: React.FC<{ pooler: ClientPlayer }> = ({ pooler }) => {
	const { send } = useGameSocket();
	return (
		<button
			onClick={() => send(InviteMessage('pong', pooler.username))}
			disabled={pooler.playerStatus === 'playing' || pooler.inviteStatus === 'declined'}
			className="font-bold w-full rounded-sm text-sm pt-2 pb-1.5 px-4 bg-dark-900 text-dark-200 hover:text-black hover:bg-accent-300 cursor-pointer duration-150"
		>
			{pooler.inviteStatus === 'pending' ? <Spinner className="mx-auto" /> : 'PONG'}
		</button>
	);
};

export const ChallangeDoom: React.FC<{ pooler: ClientPlayer }> = ({ pooler }) => {
	const { send } = useGameSocket();
	return (
		<button
			onClick={() => send(InviteMessage('card of doom', pooler.username))}
			disabled={pooler.playerStatus === 'playing' || pooler.inviteStatus === 'declined'}
			className="font-bold w-full rounded-sm text-sm pt-2 pb-1.5 px-4 bg-dark-900 text-dark-200 hover:text-black hover:bg-golden-500 cursor-pointer duration-150"
		>
			{pooler.inviteStatus === 'pending' ? <Spinner className="mx-auto" /> : 'DOOM'}
		</button>
	);
};

export const AcceptChallange: React.FC<{ invite: ClientInvitation }> = ({ invite }) => {
	const { send } = useGameSocket();
	return (
		<button
			onClick={() => send(AcceptMessage(invite.game, invite.sender))}
			disabled={invite.inviteStatus !== 'pending'}
			className="font-bold w-full rounded-sm text-sm pt-2 pb-1.5 px-4 bg-dark-900 text-dark-200 hover:text-black hover:bg-accent-300 cursor-pointer duration-150"
		>
			Accept
		</button>
	);
};

export const DeclineChallange: React.FC<{ invite: ClientInvitation }> = ({ invite }) => {
	const { send } = useGameSocket();
	return (
		<button
			onClick={() => send(RejectMessage(invite.game, invite.sender))}
			disabled={invite.inviteStatus !== 'pending'}
			className="font-bold w-full rounded-sm text-sm pt-2 pb-1.5 px-4 bg-dark-900 text-dark-200 hover:text-white hover:bg-red-600 cursor-pointer duration-150"
		>
			Reject
		</button>
	);
};
