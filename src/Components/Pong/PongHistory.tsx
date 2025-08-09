import { Box, Callout, Card, Flex, Spinner, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { HTTP_API } from '../../services/API';
import PlayerAvatar from '../PlayerAvatar';

interface Game {
	user_id: number;
	player_username: string;
	player_avatar_url: string;
	opponent_username: string;
	opponent_avatar_url: string;
	player_score: number;
	opponent_score: number;
	game_date: string;
}

interface GameHistoryProps {
	username: string;
}
const PongGameHistory: React.FC<GameHistoryProps> = ({ username }) => {
	const { isPending, error, data } = useQuery({
		queryKey: ['pongHistory'],
		queryFn: () => fetch(`${HTTP_API}/game/pong/history/${username}`, { credentials: 'include' }).then((res) => res.json()),
	});

	return (
		<Card>
			<Text weight="bold" as="div" size="3" ml="1" align="center">
				Pong History
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
						<div className="m-2" key={index}>
							<Flex align="center" justify="between">
								<PlayerAvatar username={ele.player_username} />
								<Text weight="bold">{ele.player_score}</Text>
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

export default PongGameHistory;
