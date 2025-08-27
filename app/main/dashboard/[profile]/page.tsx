import UserProfilePage from '@/app/_components/dash/friends/UserProfilePage';
import DoomHistory from '@/app/_components/dash/profile/DoomHistory';
import PongHistory from '@/app/_components/dash/profile/PongHistory';
import Stats from '@/app/_components/dash/profile/Stats';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

type Props = {
	params: Promise<{ profile: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { profile } = await params;
	if (!profile) return { ...baseMetadata };
	return {
		...baseMetadata,
		...mainAppMetadata.profile(profile),
	};
}

const Page: React.FC<{ params: Promise<{ profile: string }> }> = async ({ params }) => {
	const { profile } = await params;
	if (!profile) notFound();

	return (
		<div className="mx-auto max-w-[1400px] grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-12">
			<UserProfilePage username={profile} />
			<div>
				<Stats username={profile} />
				<PongHistory username={profile} />
				<DoomHistory username={profile} />
			</div>
		</div>
	);
};

export default Page;
