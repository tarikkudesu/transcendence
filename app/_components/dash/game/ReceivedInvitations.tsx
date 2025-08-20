'use client';

import { AcceptMessage, ClientInvitation, RejectMessage, useGameSocket } from '@/app/_service/ws/game';
import { Text } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import User from './User';

const ReceivedInvitations: React.FC = ({}) => {
	const [search, setSearch] = useState<string>('');
	const searchParams = useSearchParams();
	const { invitations, send } = useGameSocket();

	useEffect(() => {
		const profile = searchParams.get('playersearch');
		if (profile) setSearch(profile);
	}, [searchParams]);

	const filterPool = useCallback(
		(pooler: ClientInvitation): boolean => {
			if (!search) return true;
			return pooler.sender.toLowerCase().includes(search.toLowerCase());
		},
		[search]
	);

	return (
		<div className="flex-grow p-6 rounded-md bg-dark-700 my-8 shadow-lg">
			<div className="flex mb-1 mt-6">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={24} width={24} className="text-white mr-4">
					<path
						fill="currentColor"
						d="M128.4 239.8L320 97.9L511.6 239.8L353.5 357C343.8 364.2 332.1 368 320 368C307.9 368 296.2 364.1 286.5 357L128.4 239.8zM320 32C307.9 32 296.2 35.9 286.5 43L89.9 188.7C73.6 200.8 64 219.8 64 240.1L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 240.1C576 219.8 566.4 200.7 550.1 188.7L353.5 43C343.8 35.8 332.1 32 320 32z"
					/>
				</svg>

				<Text as="div" size="5" weight="bold">
					Received Invitations ({invitations.length})
				</Text>
			</div>
			<Text as="div" size="3" mb="8" className="text-dark-200">
				View all friend or game invitations you’ve received, with details and options to accept or decline.
			</Text>
			<div className="relative">
				<svg
					width={20}
					height={20}
					viewBox="0 0 640 640"
					xmlns="http://www.w3.org/2000/svg"
					className="text-dark-200 mx-3 absolute top-1/2 left-0 -translate-y-1/2"
				>
					<path
						fill="currentColor"
						d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"
					/>
				</svg>
				<input
					required
					maxLength={40}
					value={search}
					autoComplete="off"
					placeholder="Search..."
					className="w-full outline-none pr-3 pb-2 pt-2.5 pl-10 text-sm text-white rounded-md bg-transparent"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
					type="text"
					name="text"
				/>
			</div>
			{invitations.filter(filterPool).map((invite, index) => {
				return (
					<div key={index} className="flex justify-between items-center px-2">
						<User username={invite.sender} />
						<div className="flex items-center gap-2">
							<PongButton
								onClick={() => send(AcceptMessage(invite.game, invite.sender))}
								className="bg-dark-700 hover:bg-accent-300 hover:text-black"
							>
								Accept
							</PongButton>
							<PongButton
								onClick={() => () => send(RejectMessage(invite.game, invite.sender))}
								className="bg-dark-700 hover:bg-golden-500 hover:text-black"
							>
								Reject
							</PongButton>
						</div>
					</div>
				);
			})}
			{search && invitations.filter(filterPool).length === 0 && (
				<Text as="div" align="center" className="text-dark-200">
					No Invitation Found
				</Text>
			)}
		</div>
	);
};

export default ReceivedInvitations;
