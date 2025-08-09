import { Box, Button, Card, Flex, Text, Tooltip } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { RegisterMessage, useWebSocket } from '../Hooks';
import { useAuth } from '../Hooks/AuthContext';
import PlayerAvatar from './PlayerAvatar';

const Tournament: React.FC<unknown> = () => {
	const navigate = useNavigate();
	const { tournament, send } = useWebSocket();
	const { username } = useAuth();

	return (
		<Card>
			<Text weight="bold" as="div" size="3" ml="1" align="center">
				Tournament
			</Text>
			<Box height="4px" />
			<Card>
				<img
					src="/assets/Tournament.png"
					className="aspect-square"
					alt="Tournament"
					style={{
						objectFit: 'cover',
						display: 'block',
						width: '100%',
					}}
				/>
				<Flex className="flex-grow" justify="between" align="end">
					<Box>
						<Text as="div" size="3" weight="bold">
							{tournament.name}
						</Text>
						{tournament.state === 'open' && (
							<Text as="div" size="1" className="opacity-75">
								{tournament.emptySlots} empty slots
							</Text>
						)}
						{tournament.state === 'not open' && (
							<Text as="div" size="1" className="opacity-75">
								will open at {tournament.date}
							</Text>
						)}
						{tournament.state === 'playing' && (
							<Text as="div" size="1" className="opacity-75">
								This is your match
							</Text>
						)}
					</Box>
					{tournament.state === 'playing' && tournament.registered ? (
						<Button disabled={tournament.gid === ''} onClick={() => navigate('/dashboard/server/' + tournament.gid)}>
							Play
						</Button>
					) : (
						<Button
							disabled={tournament.state !== 'open' || tournament.registered}
							onClick={() => send(RegisterMessage('pong', username + '_alias'))}
						>
							Register
						</Button>
					)}
				</Flex>
			</Card>
			{tournament.state === 'playing' && (
				<>
					<Box height="12px" />
					<Card>
						<Flex align="end" justify="center" gap="4">
							{tournament.results.map((ele, index) => (
								<Tooltip content={ele.username} key={index}>
									<Flex align="center" direction="column" gap="2">
										<PlayerAvatar username={ele.username} />
										<Box
											height={`${ele.level * 20}px`}
											width="15px"
											className="rounded-full"
											style={{ backgroundColor: 'var(--accent-10)' }}
										></Box>
										<Text>{ele.level}</Text>
									</Flex>
								</Tooltip>
							))}
						</Flex>
					</Card>
				</>
			)}
			{tournament.state === 'playing' && (
				<>
					<Box height="12px" />
					<Text as="div" align="center" weight="bold">
						Tournament Live Games - ROUND {tournament.round} -
					</Text>
					{tournament.nextMatches.map((ele, index) => (
						<Card mt="2" key={index}>
							<Flex align="center" justify="center" gap="4">
								<Flex align="center" gap="2">
									<PlayerAvatar username={ele.player} />
									<Text as="div" weight="bold">
										{ele.player}
									</Text>
								</Flex>
								<Text as="div" size="7" className="font-serif" weight="bold" style={{ color: 'var(--accent-10)' }}>
									VS
								</Text>
								<Flex align="center" gap="2">
									<Text as="div" weight="bold">
										{ele.opponent}
									</Text>
									<PlayerAvatar username={ele.opponent} />
								</Flex>
							</Flex>
						</Card>
					))}
				</>
			)}
			<Box height="24px" />
		</Card>
	);
};

export default Tournament;
