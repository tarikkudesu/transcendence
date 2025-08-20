import MyDoomHistory from "@/app/_components/dash/profile/MyDoomHistory";
import MyPongHistory from "@/app/_components/dash/profile/MyPongHistory";
import MyStatsDoom from "@/app/_components/dash/profile/MyStatsDoom";
import MyStatsPong from "@/app/_components/dash/profile/MyStatsPong";
import MyStatsTournament from "@/app/_components/dash/profile/MyStatsTournament";


async function Dashboard() {
	return (
		<div className="grid grid-cols-3 grid-rows-5 gap-4">
			<div className="col-span-2 row-span-5">
				<MyPongHistory />
				<MyDoomHistory />
			</div>
			<div className="col-start-3 row-span-5">
				<MyStatsPong />
				<MyStatsDoom />
				<MyStatsTournament />
			</div>
		</div>
	);
}

export default Dashboard;
