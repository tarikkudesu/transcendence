'use client';

import { CreateMessage, useGameSocket } from '@/app/_service/ws/game';

import { Callout, Select, Text } from '@radix-ui/themes';
import React, { ChangeEvent, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';

const CreateTournament: React.FC = ({}) => {
	const [max, setMax] = useState<number>(4);
	const [name, setName] = useState<string>('');
	const [alias, setAlias] = useState<string>('');
	const { send, tournament } = useGameSocket();

	return (
		<div className="my-[80px] text-nowrap">
			<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
				Host A Tournament
			</Text>
			<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
				Stay informed about the upcoming tournament’s so you don’t miss out.
			</Text>
			<div className="flex justify-between items-center gap-4 text-dark-200 my-4 text-sm">
				<input
					required
					minLength={4}
					maxLength={24}
					value={name}
					disabled={tournament.restriction !== ''}
					placeholder="Tournament name"
					className={`flex-grow outline-none rounded-[3px] px-3 py-2.5 text-sm bg-dark-700 text-white placeholder:text-dark-300 border border-dark-100/30`}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
					type="text"
					name="name"
				></input>
				<input
					required
					value={alias}
					minLength={4}
					maxLength={24}
					placeholder="Alias"
					disabled={tournament.restriction !== ''}
					className={`flex-grow outline-none rounded-[3px] px-3 py-2.5 text-sm bg-dark-700 text-white placeholder:text-dark-300 border border-dark-100/30`}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setAlias(e.target.value)}
					name="alias"
					type="text"
				></input>
				<div className="flex gap-4 justify-center items-center">
					<Select.Root defaultValue="4" onValueChange={(value) => setMax(Number(value))} disabled={tournament.restriction !== ''}>
						<Select.Trigger className="bg-dark-700 h-[42px] w-[80px]" />
						<Select.Content className="bg-dark-700">
							<Select.Item value="4">4</Select.Item>
							<Select.Item value="8">8</Select.Item>
							<Select.Item value="16">16</Select.Item>
						</Select.Content>
					</Select.Root>
					<PongButton
						disabled={!name || !alias || tournament.restriction !== ''}
						onClick={() => send(CreateMessage('pong', name, max, alias))}
						className="bg-accent-300 disabled:bg-dark-700 disabled:text-dark-100 text-black font-bold"
					>
						Create
					</PongButton>
				</div>
			</div>
			{tournament.restriction !== '' && (
				<Callout.Root variant="soft" color="lime">
					<Callout.Text>
						Your tournament is now live! Head over to the <strong>Live</strong> tab to follow up the matches.
					</Callout.Text>
				</Callout.Root>
			)}
		</div>
	);
};

export default CreateTournament;
