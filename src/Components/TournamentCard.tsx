import { Box, Callout, Card, Dialog, Flex, Heading, Spinner, Text, Tooltip } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import PlayerAvatar from './PlayerAvatar';
import { HTTP_API } from '../services/API';
import { useCallback } from 'react';

interface Match {
	user: string;
	opponent: string;
	user_score: number;
	opponent_score: number;
	date: string;
}
interface Contestant {
	username: string;
	avatar_url: string;
	round_level: number;
}
export interface TournamentMini {
	tournament_date: string;
	tournament_name: string;
}

interface SingleTournamentCardProps {
	name: string;
}
const SingleTournamentCard: React.FC<SingleTournamentCardProps> = ({ name }) => {
	const { isPending, error, data } = useQuery({
		queryKey: [name],
		queryFn: () => fetch(`${HTTP_API}/game/tournament/${name}`, { credentials: 'include' }).then((res) => res.json()),
	});

	console.log(data);
	
	if (isPending)
		return (
			<div className="flex justify-center">
				<Spinner />
			</div>
		);

	if (error)
		return (
			<Callout.Root color="red">
				<Callout.Text>An error has occured</Callout.Text>
			</Callout.Root>
		);

	return (
		<>
			<Heading>{name}</Heading>
			<Box height="48px" />
			<Text size="4" weight="bold">
				Results
			</Text>
			<Card>
				<Flex align="end" justify="center" gap="4">
					{data &&
						data?.stats?.Contestants.map((ele: Contestant, index: number) => (
							<Tooltip content={ele.username} key={index}>
								<Flex align="center" direction="column" gap="2">
									<PlayerAvatar username={ele.username} />
									<Box
										height={`${(ele.round_level + 1) * 20}px`}
										width="15px"
										className="rounded-full"
										style={{ backgroundColor: 'var(--accent-10)' }}
									></Box>
									<Text>{ele.round_level}</Text>
								</Flex>
							</Tooltip>
						))}
				</Flex>
			</Card>
			<Box height="48px" />
			<Text size="4" weight="bold">
				Games
			</Text>
			{data &&
				data?.stats?.matches.map((ele: Match, index: number) => {
					return (
						<div key={index}>
							<Card mt="2">
								<Flex align="center" justify="center" gap="4">
									<Flex align="center" gap="2">
										<PlayerAvatar username={ele.user} />
										<Text as="div" weight="bold">
											{ele.user_score}
										</Text>
									</Flex>
									<Text as="div" size="7" className="font-serif" weight="bold" style={{ color: 'var(--accent-10)' }}>
										::
									</Text>
									<Flex align="center" gap="2">
										<Text as="div" weight="bold">
											{ele.opponent_score}
										</Text>
										<PlayerAvatar username={ele.opponent} />
									</Flex>
								</Flex>
							</Card>
							<Box height="8px" />
						</div>
					);
				})}
		</>
	);
};

const TournamentMiniCard: React.FC<unknown> = () => {
	const { isPending, error, data } = useQuery({
		queryKey: ['tournament_history'],
		queryFn: () => fetch(`${HTTP_API}/game/tournament/history`, { credentials: 'include' }).then((res) => res.json()),
	});

	const content = useCallback(() => {
		if (isPending)
			return (
				<div className="flex justify-center">
					<Spinner />
				</div>
			);
		if (error)
			return (
				<Callout.Root color="red">
					<Callout.Text>An error has occured</Callout.Text>
				</Callout.Root>
			);
		return (
			<>
				{data &&
					data.history &&
					data.history.map((ele: TournamentMini, index: number) => (
						<div className="cursor-pointer" key={index}>
							<Dialog.Root>
								<Dialog.Trigger>
									<Card m="2">
										<Text as="div" size="3" weight="bold">
											{ele.tournament_name}
										</Text>
										<Text as="div" size="1">
											{ele.tournament_date}
										</Text>
									</Card>
								</Dialog.Trigger>
								<Dialog.Content>
									<SingleTournamentCard name={ele.tournament_name} />
								</Dialog.Content>
							</Dialog.Root>
						</div>
					))}
			</>
		);
	}, [data, error, isPending]);

	return (
		<>
			<Card>
				<Text weight="bold" as="div" size="3" ml="1" align="center">
					Tournament History
				</Text>
				<Box height="4px" />
				{content()}
			</Card>
		</>
	);
};

export default TournamentMiniCard;
