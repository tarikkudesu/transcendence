import PongHistory from '@/app/_components/dash/fetchall/PongHistory';
import Footer from '@/app/_components/mini/Footer';
import Header from '@/app/_components/mini/Header';
import { Text } from '@radix-ui/themes';
import { notFound } from 'next/navigation';

const Page: React.FC<{ params: Promise<{ profile: string }> }> = async ({ params }) => {
	const { profile } = await params;
	if (!profile) notFound();

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
				<PongHistory username={profile} />
			</div>
			<Footer />
		</>
	);
};

export default Page;
