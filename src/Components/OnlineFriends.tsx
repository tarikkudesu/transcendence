import { Box, Card, Flex, Text } from '@radix-ui/themes';
import PlayerAvatar from './PlayerAvatar';
import { useWebSocket } from '../Hooks';

const OnlineFriends: React.FC<unknown> = () => {
	const { pool } = useWebSocket();
	return (
		<Card>
			<Text weight="bold" as="div" size="3" ml="1" align="center">
				Online Friends
			</Text>
			<Box height="2px" />
			{pool.length === 0 ? (
				<Text as="div" size="1" align="center" className="opacity-75" my="2">
					The pool is empty
				</Text>
			) : (
				<Flex align="center" justify="start" wrap="wrap">
					{pool.map((pooler, index) => {
						return <PlayerAvatar key={index} username={pooler.username} pooler={pooler} />;
					})}
				</Flex>
			)}
		</Card>
	);
};

export default OnlineFriends;
