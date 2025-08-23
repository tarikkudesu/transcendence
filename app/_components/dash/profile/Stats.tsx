'use client';

import { DoomSummary, PongSummary } from '@/app/_service/game/schemas';
import { useGET } from '@/app/_service/useFetcher';
import { SvgChart } from '@/app/_svg/svg';
import { Separator, Text } from '@radix-ui/themes';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

const Stats: React.FC<{ username: string }> = ({ username }) => {
	const {
		data: pong,
		isLoading: pongIsLoading,
		error: pongError,
	} = useGET<PongSummary>({ url: `${API_BASE}/game/pong/summary/${username}` });
	const {
		data: doom,
		isLoading: doomIsLoading,
		error: doomError,
	} = useGET<DoomSummary>({ url: `${API_BASE}/game/doom/summary/${username}` });

	function content() {
		if (pongIsLoading || doomIsLoading) return <>Loading...</>;
		if (pongError || doomError || !pong || !doom) return <>Error...</>;
		return (
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
		);
	}
	return (
		<div className="flex-grow p-4 rounded-md bg-dark-700 my-8 text-sm">
			<div className="flex mb-1 mt-2">
				<SvgChart size={24} className="text-white mr-4" />
				<Text as="div" size="5" weight="bold">
					Stats
				</Text>
			</div>
			<Separator size="4" my="2" />
			{content()}
		</div>
	);
};

export default Stats;
