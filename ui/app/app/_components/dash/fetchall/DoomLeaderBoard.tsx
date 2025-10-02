'use client';

import client from '@/app/_service/axios/client';
import { LeaderboardEntry } from '@/app/_service/schema';
import { Box, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import Error from '../../mini/Error';
import { Spinner } from '../../mini/Loading';
import { User } from '../game/User';

const DoomLeaderBoard: React.FC<{ page: number }> = ({ page }) => {
	const router = useRouter();
	const fetchData = (): Promise<LeaderboardEntry[]> =>
		client.get(`/game/doom/leaderboard?begin=${page * 20}&end=${20}`).then((response) => response.data);
	const { data, error, isPending } = useQuery({
		queryKey: ['gamedoomleaderboardall'],
		queryFn: fetchData,
	});

	const changePage = useCallback(
		(back: boolean) => {
			if (back) {
				if (page > 0) router.push(`/doomhistory/${page - 1}`);
			} else {
				if (data?.length === 20) router.push(`/doomhistory/${page + 1}`);
			}
		},
		[data?.length, page, router]
	);

	if (isPending) return <Spinner />;
	if (error || !data) return <Error />;

	return (
		<>
			{data &&
				data.map((ele, index) => (
					<div key={index} className="bg-dark-950 rounded-md px-[10%] py-[40px] m-8">
						<div className="flex justify-between items-center">
							<div className="flex justify-start gap-4">
								<div className="h-[42px] w-[42px] rounded-full bg-dark-500 flex justify-center items-center text-xl font-black">
									<div className="translate-y-0.5">{index + 1}</div>
								</div>
								<User.Trigger
									username={ele.username}
									avatar={ele.avatar_url}
									extra={
										<Text as="div" size="2" weight="bold" className="text-dark-300">
											RANK #{index + 1}
										</Text>
									}
								></User.Trigger>
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
			<Box height="24px" />
			<div className="flex justify-between items-center">
				<PongButton onClick={() => changePage(true)} className="bg-dark-800 text-dark-200 hover:text-white">
					Previous
				</PongButton>
				<div className="text-white">{page}</div>
				<PongButton onClick={() => changePage(false)} className="bg-dark-800 text-dark-200 hover:text-white">
					Next
				</PongButton>
			</div>
		</>
	);
};

export default DoomLeaderBoard;
