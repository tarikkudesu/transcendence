'use client';

import SafeImage from '@/app/_components/SafeImage';
import { RequestResult } from '@/app/_service/auth/calls';
import { fetchDoomLeaderboard } from '@/app/_service/game/calls';
import { LeaderboardEntry } from '@/app/_service/game/schemas';
import { Text } from '@radix-ui/themes';
import { useCallback, useEffect, useState } from 'react';
import UserCallout from '../game/UserCallout';

const PongLeaderBoard: React.FC = ({}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setError] = useState<boolean>(false);
	const [leaderBoard, setLeaderBoard] = useState<LeaderboardEntry[]>([]);

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const res: RequestResult = await fetchDoomLeaderboard();
				if (res.message === 'success') {
					setLeaderBoard(res.result.slice(0, 3));
				} else {
					setError(true);
				}
			} catch (err) {
				void err;
				setError(true);
			}
			setIsLoading(false);
		}
		fetchData();
	}, []);

	const content = useCallback(() => {
		if (isLoading)
			return (
				<Text as="div" align="center" mt="5s">
					Loading...
				</Text>
			);
		if (isError)
			return (
				<Text as="div" align="center" mt="5s">
					ErrorPage
				</Text>
			);
		return (
			<>
				{leaderBoard.map((ele, index) => (
					<div key={index} className="bg-dark-950 px-[10%] py-[40px] mb-[10px]">
						<div className="flex justify-between items-center">
							<div className="flex justify-start gap-4">
								<div className="h-[42px] w-[42px] rounded-full bg-dark-500 flex justify-center items-center text-xl font-black">
									<div className="translate-y-0.5">{index}</div>
								</div>
								<UserCallout username={ele.username}>
									<SafeImage
										fallbackSrc="/Logo.png"
										priority
										className="rounded-full cursor-pointer"
										src={ele.avatar_url}
										alt="player card"
										width={42}
										height={42}
									></SafeImage>
								</UserCallout>
								<div className="">
									<Text as="div" size="5" weight="bold" className="text-white">
										{ele.username}
									</Text>
									<Text as="div" size="2" weight="bold" className="text-dark-300">
										RANK #{index}
									</Text>
								</div>
							</div>
							<div className="">
								<Text align="right" as="div" size="8" weight="bold" className="text-accent-300">
									{ele.winns}
								</Text>
								<Text align="right" as="div" size="2" weight="bold" className="text-dark-300">
									winns
								</Text>
							</div>
						</div>
					</div>
				))}
			</>
		);
	}, [isError, isLoading, leaderBoard]);

	return <>{content()}</>;
};

export default PongLeaderBoard;
