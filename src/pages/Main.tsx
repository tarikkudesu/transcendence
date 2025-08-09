import OnlineFriends from '../Components/OnlineFriends';
import Tournament from '../Components/Tournament';
import TournamentMiniCard from '../Components/TournamentCard';
import { Card, Flex } from '@radix-ui/themes';
import PongGameHistory from '../Components/Pong/PongHistory';
import DoomGameHistory from '../Components/Doom/DoomHistory';
import PongLeaderBoard from '../Components/Doom/LeaderBoard';
import DoomLeaderBoard from '../Components/Pong/LeaderBoard';
import { useAuth } from '../Hooks/AuthContext';

const Main: React.FC<unknown> = () => {
	const { username } = useAuth();

	return (
		<>
			<div className="parentdash">
				<div className="div1dash">
					<Flex gap="4" direction="column">
						<OnlineFriends />
						<Tournament />
						<TournamentMiniCard />
						<PongLeaderBoard />
						<DoomLeaderBoard />
						<PongGameHistory username={username} />
						<DoomGameHistory username={username} />
					</Flex>
				</div>
				<div className="div2dash">
					<Card>
						<div className="p-12">
							<div className="max-w-280 bg-amber-500/10 border-1 border-white aspect-[4/3] relative overflow-hidden mx-auto">
								<div
									className="bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80"
									style={{ width: 2, height: '100%' }}
								></div>
								<div
									className="border-2 border-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80"
									style={{ height: 100, width: 100 }}
								></div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</>
	);
};

export default Main;
