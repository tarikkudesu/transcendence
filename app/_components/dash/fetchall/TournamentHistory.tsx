'use client';

import client from '@/app/_service/axios/client';
import { TournamentHistoryEntry } from '@/app/_service/schema';
import { Box, Flex, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import Error from '../../mini/Error';
import { Spinner } from '../../mini/Loading';

const TournamentHistory: React.FC<{ page: number }> = ({ page }) => {
	const router = useRouter();
	const fetchData = (): Promise<TournamentHistoryEntry[]> =>
		client.get(`/game/tournament/history?begin=${page * 20}&end=${20}`).then((response) => response.data);
	const { data, error, isPending } = useQuery({
		queryKey: ['gametournamenthistoryall'],
		queryFn: fetchData,
	});

	const changePage = useCallback(
		(back: boolean) => {
			if (back) {
				if (page > 0) router.push(`/main/doomhistory/${page - 1}`);
			} else {
				if (data?.length === 20) router.push(`/main/doomhistory/${page + 1}`);
			}
		},
		[data?.length, page]
	);

	if (isPending) return <Spinner />;
	if (error || !data) return <Error />;

	return (
		<>
			{data &&
				data.map((ele, index) => {
					return (
						<div key={index} className="bg-dark-950 px-[10%] py-[40px] mb-[10px]">
							<Flex justify="between" align="center">
								<Text as="div" size="7" className="font-black text-white">
									{ele.tournament_name}
									<Text as="div" size="3" className="text-dark-200">
										{ele.tournament_date}
									</Text>
								</Text>
								<Link href={'/main/dashboard/tournament/' + ele.tournament_name}>
									<button className="py-3 px-6 text-center bg-accent-300 text-xs text-black rounded-md cursor-pointer font-bold">
										See Details
									</button>
								</Link>
							</Flex>
						</div>
					);
				})}
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

export default TournamentHistory;
