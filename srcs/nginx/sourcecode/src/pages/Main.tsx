import { useContext } from 'react';
import { Card, Grid, Text, Box, Avatar, Flex, Button, Tooltip } from '@radix-ui/themes';
import { RegisterMessage, wsContext } from '../Hooks/ws-client';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../Redux/Store';
import LeaderBoard from '../Components/LeaderBoard';
import GameHistory from '../Components/GameHistory';
import TournamentMiniCard from '../Components/TournamentCard';
import PlayerAvatar from '../Components/PlayerAvatar';

const Main: React.FC<unknown> = () => {
	const navigate = useNavigate();
	const { pool, tournament, send, hash } = useContext(wsContext);
	const username: string = useSelector((state: RootState) => state.user.username);

	return (
		<>
			<div className="max-w-500 mx-auto px-12">
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
				<Box height="12px" />
				<Grid columns={{ initial: '1', md: '3' }} gap="3">
					<LeaderBoard />
					<GameHistory username={username} />
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
									<Button
										disabled={tournament.gid === ''}
										onClick={() => navigate('/dashboard/server/' + tournament.gid)}
									>
										Play
									</Button>
								) : (
									<Button
										disabled={tournament.state !== 'open' || tournament.registered}
										onClick={() => send(RegisterMessage(username, hash, 'pong', username + '_alias'))}
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
													<Avatar
														size="1"
														radius="full"
														fallback={`${ele.username[0]}`}
														className="border-2 p-0.5"
														style={{ borderColor: 'var(--accent-10)' }}
													/>
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
												<Avatar
													size="2"
													radius="full"
													fallback={'E'}
													className="border-2 p-0.5"
													style={{ borderColor: 'var(--accent-10)' }}
												/>
												<Text as="div" weight="bold">
													{ele.player}
												</Text>
											</Flex>
											<Text
												as="div"
												size="7"
												className="font-serif"
												weight="bold"
												style={{ color: 'var(--accent-10)' }}
											>
												VS
											</Text>
											<Flex align="center" gap="2">
												<Text as="div" weight="bold">
													{ele.opponent}
												</Text>
												<Avatar
													size="2"
													radius="full"
													fallback="K"
													className="border-2 p-0.5"
													style={{ borderColor: 'var(--accent-10)' }}
												/>
											</Flex>
										</Flex>
									</Card>
								))}
							</>
						)}
						<Box height="24px" />
						<TournamentMiniCard />
					</Card>
				</Grid>
			</div>
		</>
	);
};

export default Main;
