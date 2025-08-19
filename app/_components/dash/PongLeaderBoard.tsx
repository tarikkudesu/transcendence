'use client';

import { RequestResult } from '@/app/_service/auth/calls';
import { fetchPongLeaderboard } from '@/app/_service/game/calls';
import { LeaderboardEntry } from '@/app/_service/game/schemas';
import { Box, Flex, Text } from '@radix-ui/themes';

import SafeImage from '@/app/_components/SafeImage';
import { useCallback, useEffect, useState } from 'react';
import UserCallout from './game/UserCallout';

interface PongLeaderBoardPlayerProps {
	player: LeaderboardEntry;
}
const PongLeaderBoardFirstPlayer: React.FC<PongLeaderBoardPlayerProps> = ({ player }) => {
	return (
		<div className="flex flex-col items-center justify-center">
			<Box height="50px" />
			<Box height="340px" className="bg-dark-950 rounded-t-[100px] relative w-[200px]">
				{/* <svg
					className="text-accent-300 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[80px]"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 640 640"
					width={50}
					height={50}
				>
					<path
						fill="currentColor"
						d="M345 151.2C354.2 143.9 360 132.6 360 120C360 97.9 342.1 80 320 80C297.9 80 280 97.9 280 120C280 132.6 285.9 143.9 295 151.2L226.6 258.8C216.6 274.5 195.3 278.4 180.4 267.2L120.9 222.7C125.4 216.3 128 208.4 128 200C128 177.9 110.1 160 88 160C65.9 160 48 177.9 48 200C48 221.8 65.5 239.6 87.2 240L119.8 457.5C124.5 488.8 151.4 512 183.1 512L456.9 512C488.6 512 515.5 488.8 520.2 457.5L552.8 240C574.5 239.6 592 221.8 592 200C592 177.9 574.1 160 552 160C529.9 160 512 177.9 512 200C512 208.4 514.6 216.3 519.1 222.7L459.7 267.3C444.8 278.5 423.5 274.6 413.5 258.9L345 151.2z"
					/>
				</svg> */}
				<svg
					className="text-accent-300 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[80px]"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 640 640"
					width={50}
					height={50}
				>
					<path
						fill="currentColor"
						d="M320 144C346.5 144 368 122.5 368 96C368 69.5 346.5 48 320 48C293.5 48 272 69.5 272 96C272 122.5 293.5 144 320 144zM69.5 249L192 448L135.8 518.3C130.8 524.6 128 532.4 128 540.5C128 560.1 143.9 576 163.5 576L476.4 576C496 576 511.9 560.1 511.9 540.5C511.9 532.4 509.2 524.6 504.1 518.3L448 448L570.5 249C574.1 243.1 576 236.3 576 229.4L576 228.8C576 208.5 559.5 192 539.2 192C531.9 192 524.8 194.2 518.8 198.2L501.9 209.5C489.2 218 472.3 216.3 461.5 205.5L427.4 171.4C420.1 164.1 410.2 160 400 160C389.8 160 379.9 164.1 372.7 171.3L342.6 201.4C330.1 213.9 309.8 213.9 297.3 201.4L267.2 171.3C260.1 164.1 250.2 160 240 160C229.8 160 219.9 164.1 212.7 171.3L178.6 205.4C167.8 216.2 150.9 217.9 138.2 209.4L121.3 198.2C115.2 194.2 108.1 192 100.9 192C80.6 192 64.1 208.5 64.1 228.8L64.1 229.4C64.1 236.3 66 243.1 69.6 249z"
					/>
				</svg>
				<SafeImage
					fallbackSrc="/Logo.png"
					priority
					className="rounded-full border-4 border-accent-300 absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4"
					src={player.avatar_url}
					alt="player card"
					width={120}
					height={120}
				></SafeImage>
				<Text as="div" align="center" size="4" weight="bold" className="text-white absolute bottom-4 left-1/2 -translate-x-1/2 ">
					<UserCallout username={player.username}>{player.username}</UserCallout>
					<Text as="div" align="center" size="6" weight="bold" className="text-accent-300 my-4">
						{player.winns}
					</Text>
				</Text>
			</Box>
		</div>
	);
};
const PongLeaderBoardSecondPlayer: React.FC<PongLeaderBoardPlayerProps> = ({ player }) => {
	return (
		<div className="flex flex-col items-center justify-center">
			<Box height="140px" />
			<Box height="250px" className="bg-dark-900 rounded-tr-[100px] relative w-[200px]">
				<SafeImage
					fallbackSrc="/Logo.png"
					priority
					className="rounded-full border-4 border-orange-500 absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4"
					src={player.avatar_url}
					alt="player card"
					width={100}
					height={100}
				></SafeImage>
				<Text as="div" align="center" size="4" weight="bold" className="text-white absolute bottom-4 left-1/2 -translate-x-1/2 ">
					<UserCallout username={player.username}>{player.username}</UserCallout>
					<Text as="div" align="center" size="6" weight="bold" className="text-orange-500 my-4">
						{player.winns}
					</Text>
				</Text>
			</Box>
		</div>
	);
};
const PongLeaderBoardThirdPlayer: React.FC<PongLeaderBoardPlayerProps> = ({ player }) => {
	return (
		<div className="flex flex-col items-center justify-center">
			<Box height="160px" />
			<Box height="230px" className="bg-dark-800 rounded-tl-[100px] relative w-[200px]">
				<SafeImage
					fallbackSrc="/Logo.png"
					priority
					className="rounded-full border-4 border-magenta-600 absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4"
					src={player.avatar_url}
					alt="player card"
					width={80}
					height={80}
				></SafeImage>
				<Text as="div" align="center" size="4" weight="bold" className="text-white absolute bottom-4 left-1/2 -translate-x-1/2 ">
					<UserCallout username={player.username}>{player.username}</UserCallout>
					<Text as="div" align="center" size="6" weight="bold" className="text-magenta-600 my-4">
						{player.winns}
					</Text>
				</Text>
			</Box>
		</div>
	);
};

const PongLeaderBoard: React.FC = ({}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setError] = useState<boolean>(false);
	const [leaderBoard, setLeaderBoard] = useState<LeaderboardEntry[]>([]);

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const res: RequestResult = await fetchPongLeaderboard();
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
			<Flex justify="center" align="center" className="px-[40px] pt-[20px] min-h-[410px]">
				{leaderBoard.length === 3 && (
					<>
						<PongLeaderBoardThirdPlayer player={leaderBoard[2]} />
						<PongLeaderBoardFirstPlayer player={leaderBoard[0]} />
						<PongLeaderBoardSecondPlayer player={leaderBoard[1]} />
					</>
				)}
			</Flex>
		);
	}, [isError, isLoading, leaderBoard]);

	return <>{content()}</>;
};

export default PongLeaderBoard;
