'use client';

import { ClientInvitation, useGameSocket } from '@/app/_service/ws/game';
import { Flex, Text } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import UserCallout from './UserCallout';

const ReceivedInvitations: React.FC = ({}) => {
	const [search, setSearch] = useState<string>('');
	const searchParams = useSearchParams();
	const { invitations } = useGameSocket();

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
			<input
				required
				maxLength={40}
				value={search}
				placeholder="Search Online Players"
				className="w-full my-1 outline-none rounded-sm px-3 py-2 text-sm text-white bg-dark-950 border-accent-300 border-[1px]"
				onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
				type="text"
				name="text"
			></input>
			<Flex gap="6" className="flex-wrap p-4">
				{invitations.filter(filterPool).map((invite, index) => {
					return (
						<div key={index} className="p-2 flex justify-between items-center">
							<Text as="div" align="center" size="2" className="text-accent-300 font-black">
								Invitation from <UserCallout username={invite.sender}>{invite.sender}</UserCallout>
							</Text>
							<div className="">
								<button className="py-3 px-4 text-center bg-accent-300 text-xs text-black rounded-sm cursor-pointer font-bold mr-4">
									Accept
								</button>
								<button className="py-3 px-4 text-center bg-red-300 text-xs text-white rounded-sm cursor-pointer font-bold">
									Decline
								</button>
							</div>
						</div>
					);
				})}
			</Flex>
			{search && invitations.filter(filterPool).length === 0 && (
				<Text as="div" align="center" className="text-dark-200">
					No Invitation Found
				</Text>
			)}
		</div>
	);
};

export default ReceivedInvitations;
