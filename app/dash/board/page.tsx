import MyStatsDoom from '@/app/_components/dash/MyStatsDoom';
import MyStatsPong from '@/app/_components/dash/MyStatsPong';

async function Dashboard() {
	return (
		<div className="m-4">
			<MyStatsPong />
			<MyStatsDoom />
		</div>
	);
}

export default Dashboard;
