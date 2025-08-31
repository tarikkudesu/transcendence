import PongHistory from '@/app/_components/dash/fetchall/PongHistory';
import Footer from '@/app/_components/mini/Footer';
import Header from '@/app/_components/mini/Header';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import { Text } from '@radix-ui/themes';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
	params: Promise<{ profile: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { profile } = await params;
	if (!profile) return { ...baseMetadata };
	return {
		...baseMetadata,
		...mainAppMetadata.pongHistory(profile),
	};
}

const Page: React.FC<{ params: Promise<{ profile: string; page: string }> }> = async ({ params }) => {
	const { profile, page } = await params;
	if (!profile || !page) notFound();

	return (
		<>
			<Header />
			<div className="max-w-[1000px] mx-auto my-4">
				<div className="my-[80px]">
					<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
						Ping Pong History
					</Text>
					<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
						Watch ongoing tournament games in real time and track their progress from start to finish.
					</Text>
				</div>
				<PongHistory username={profile} page={Number(page)} />
			</div>
			<Footer />
		</>
	);
};

export default Page;
