'use client';

import client from '@/app/_service/axios/client';
import { PongSummary } from '@/app/_service/schema';
import { SvgChart } from '@/app/_svg/svg';
import { Separator, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../../mini/Loading';

const Stats: React.FC<{ username: string }> = ({ username }) => {
	const fetchDataP = (): Promise<PongSummary> => client.get(`/game/pong/summary/${username}`).then((response) => response.data);
	const { data: pong, isPending: pongIsLoading } = useQuery({
		queryKey: [`gamepongsummary${username}`],
		queryFn: fetchDataP,
	});
	const fetchDataD = (): Promise<PongSummary> => client.get(`/game/doom/summary/${username}`).then((response) => response.data);
	const { data: doom, isPending: doomIsLoading } = useQuery({
		queryKey: [`gamedoomsummary${username}`],
		queryFn: fetchDataD,
	});

	return (
		<div className="flex-grow p-4 rounded-md bg-dark-700 my-8 text-sm">
			<div className="flex mb-1 mt-2">
				<SvgChart size={24} className="text-white mr-4" />
				<Text as="div" size="5" weight="bold">
					Stats
				</Text>
			</div>
			<Separator size="4" my="2" />
			{pongIsLoading || (doomIsLoading && <Spinner />)}
			{pong && doom && (
				<>
					<div className="flex justify-between items-center my-1">
						<div className="text-dark-200">Ping Pong</div>
						<div className="text-dark-200">
							{pong.total_games} Played / {pong.total_winns} Won
						</div>
					</div>
					<div className="flex justify-between items-center my-1">
						<div className="text-dark-200">Cards of Doom</div>
						<div className="text-dark-200">
							{doom.total_games} Played / {doom.total_winns} Won
						</div>
					</div>
					<div className="flex justify-between items-center my-1">
						<div className="text-dark-200">Tournaments</div>
						<div className="text-dark-200">
							{pong.totalTournamentPlayed} Played / {pong.totalTournamentWinns} Won
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Stats;
