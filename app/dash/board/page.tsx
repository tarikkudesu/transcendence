import MyDoomHistory from '@/app/_components/dash/MyDoomHistory';
import MyPongHistory from '@/app/_components/dash/MyPongHistory';
import MyStatsDoom from '@/app/_components/dash/MyStatsDoom';
import MyStatsPong from '@/app/_components/dash/MyStatsPong';
import MyStatsTournament from '@/app/_components/dash/MyStatsTournament';
import { Flex } from '@radix-ui/themes';

async function Dashboard() {
	return (
		<div className="">
			<Flex gap="6" justify="between">
				<div className="flex-grow">
					<MyPongHistory />
					<MyDoomHistory />
				</div>
				<div className="w-[35%]">
					<MyStatsPong />
					<MyStatsDoom />
					<MyStatsTournament />
				</div>
			</Flex>
		</div>
	);
}

export default Dashboard;
