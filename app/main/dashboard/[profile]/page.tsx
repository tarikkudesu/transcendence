import UserProfilePage from '@/app/_components/dash/friends/UserProfilePage';
import DoomHistory from '@/app/_components/dash/profile/DoomHistory';
import PongHistory from '@/app/_components/dash/profile/PongHistory';
import Stats from '@/app/_components/dash/profile/Stats';
import { notFound } from 'next/navigation';
import React from 'react';

const Page: React.FC<{ params: Promise<{ profile: string }> }> = async ({ params }) => {
	const { profile } = await params;
	if (!profile) notFound();

	return (
		<div className="mx-auto max-w-[1400px] grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-12">
			<UserProfilePage username={profile} />
			<div className="">
				<Stats username={profile} />
				<PongHistory username={profile} />
				<DoomHistory username={profile} />
			</div>
		</div>
	);
};

export default Page;
