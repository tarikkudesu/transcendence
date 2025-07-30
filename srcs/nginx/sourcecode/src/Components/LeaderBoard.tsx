import { Box, Callout, Card, Flex, Spinner, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import PlayerAvatar from './PlayerAvatar';

interface Player {
	id: number;
	username: string;
	avatar_url: string;
	winns: number;
}

const LeaderBoard: React.FC<unknown> = () => {
	const { isPending, error, data } = useQuery({
		queryKey: ['leaderboard'],
		queryFn: () => fetch('http://localhost:3004/api/pong/leaderboard').then((res) => res.json()),
	});

	return (
		<Card>
			<Text weight="bold" as="div" size="3" ml="1" align="center">
				Leader Board
			</Text>
			<Box height="4px" />
			{isPending && (
				<div className="flex justify-center">
					<Spinner />
				</div>
			)}
			{error && (
				<Callout.Root color="red">
					<Callout.Text>An error has occured</Callout.Text>
				</Callout.Root>
			)}
			{data &&
				data.leaderboard &&
				data.leaderboard.map((ele: Player, index: number) => {
					return (
						<div className="m-4" key={index}>
							<Flex align="center" justify="start" key={index} gap="2">
								<PlayerAvatar username={ele.username} />
								<div className="">
									<Text as="div" weight="bold" size="2">
										{ele.username}
									</Text>
									<Text as="div" size="1" className="opacity-75">
										{ele.winns} wins
									</Text>
								</div>
							</Flex>
						</div>
					);
				})}
		</Card>
	);
};
export default LeaderBoard;
