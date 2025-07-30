import { Box, Callout, Card, Flex, Spinner, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import PlayerAvatar from './PlayerAvatar';

interface Game {
	user_id: number;
	user_username: string;
	player_avatar_url: string;
	opponent_username: string;
	opponent_avatar_url: string;
	user_score: number;
	opponent_score: number;
	game_date: string;
}

interface GameHistoryProps {
	username: string;
}
const GameHistory: React.FC<GameHistoryProps> = ({ username }) => {
	const { isPending, error, data } = useQuery({
		queryKey: ['pongHistory'],
		queryFn: () => fetch(`http://localhost:3004/api/pong/history/${username}`).then((res) => res.json()),
	});

	return (
		<Card>
			<Text weight="bold" as="div" size="3" ml="1" align="center">
				Game History
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
				data.history &&
				data.history.map((ele: Game, index: number) => {
					return (
						<div className="m-2">
							<Flex align="center" justify="between" key={index}>
								<PlayerAvatar username={ele.user_username} />
								<Text weight="bold">{ele.user_score}</Text>
								<Text weight="bold">:</Text>
								<Text weight="bold">{ele.opponent_score}</Text>
								<PlayerAvatar username={ele.opponent_username} />
							</Flex>
						</div>
					);
				})}
		</Card>
	);
};
export default GameHistory;
