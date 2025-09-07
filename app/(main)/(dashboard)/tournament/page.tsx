import AvailableTournaments from '@/app/_components/dash/tournament/AvailableTournaments';
import CreateTournament from '@/app/_components/dash/tournament/CreateTournament';
import CurrentMatches from '@/app/_components/dash/tournament/CurrentMatches';
import CurrentStrikes from '@/app/_components/dash/tournament/CurrentStrikes';
import NextTournament from '@/app/_components/dash/tournament/NextTournament';
import TournamentHistory from '@/app/_components/dash/tournament/TournamentHistory';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import { Tabs, Text } from '@radix-ui/themes';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
	...baseMetadata,
	...mainAppMetadata.tournament,
};

const Tournament: React.FC<unknown> = () => {
	return (
		<div className="mx-auto max-w-[1400px] my-[40px]">
			<Tabs.Root defaultValue="live">
				<Tabs.List>
					<Tabs.Trigger value="live">
						<Text className="p-4">Live</Text>
					</Tabs.Trigger>
					<Tabs.Trigger value="host">
						<Text className="p-4">Host</Text>
					</Tabs.Trigger>
					<Tabs.Trigger value="browse">
						<Text className="p-4">Browse</Text>
					</Tabs.Trigger>
					<Tabs.Trigger value="history">
						<Text className="p-4">History</Text>
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="live">
					<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-12 my-[40px]">
						<NextTournament />
						<div className="mt-[60px]">
							<Text
								mt="4"
								as="div"
								size="3"
								weight="bold"
								align="center"
								className="text-accent-300 p-2 rounded-tr-md rounded-tl-md bg-accent-300/10"
							>
								Tournament Rules
							</Text>
							<Text
								as="div"
								size="3"
								mb="2"
								className="text-dark-200 p-6 rounded-br-md rounded-bl-md bg-dark-700 mb-8 shadow-xl"
							>
								To get started, Head to the <strong className="text-accent-200/90">Browse</strong> tab to find and register
								for a tournament. Please choose carefully, as{' '}
								<strong className="text-accent-200/90">registration is final and cannot be undone</strong>. Once the
								tournament begins, you will be notified of your next match. Be ready, as you must{' '}
								<strong className="text-accent-200/90">
									join your match within one minute of the notification or you will automatically forfeit
								</strong>
								. Furthermore, any{' '}
								<strong className="text-accent-200/90">
									disconnection during a live match will result in an immediate loss
								</strong>
								. You can track all the action, including your progress and the tournament bracket, here in the{' '}
								<strong className="text-accent-200/90">Live</strong> tab. Good luck, and stay connected.
							</Text>
						</div>
						<CurrentMatches />
						<CurrentStrikes />
					</div>
				</Tabs.Content>
				<Tabs.Content value="host">
					<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-12 my-[40px]">
						<CreateTournament />
						<div className="mt-[60px]">
							<Text
								mt="4"
								as="div"
								size="3"
								weight="bold"
								align="center"
								className="text-accent-300 p-2 rounded-tr-md rounded-tl-md bg-accent-300/10"
							>
								Host Rules
							</Text>
							<Text
								as="div"
								size="3"
								mb="2"
								className="text-dark-200 p-6 rounded-br-md rounded-bl-md bg-dark-700 mb-8 shadow-xl"
							>
								You can host your own tournament by choosing a name, a size (4, 8, or 16 players), and an alias you will
								compete under. As the host, you are{' '}
								<strong className="text-accent-200/90">automatically registered to play</strong>. Please note that you can
								only run <strong className="text-accent-200/90">one tournament at a time</strong>, and it will be{' '}
								<strong className="text-accent-200/90">automatically canceled</strong> if all player slots are not filled
								within 15 minutes of its creation.
							</Text>
						</div>
					</div>
				</Tabs.Content>
				<Tabs.Content value="browse">
					<div className="grid grid-cols-1 my-[40px]">
						<AvailableTournaments />
					</div>
				</Tabs.Content>
				<Tabs.Content value="history">
					<div className="grid grid-cols-1 my-[40px]">
						<TournamentHistory />
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	);
};

export default Tournament;
