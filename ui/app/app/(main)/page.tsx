import { Box, Tabs } from '@radix-ui/themes';
import React from 'react';

import { Text } from '@radix-ui/themes';
import { Metadata } from 'next';
import Blocked from '../_components/dash/settings/Blocked';
import UpdateAvatar from '../_components/dash/settings/UpdateAvatar';
import UpdateBio from '../_components/dash/settings/UpdateBio';
import UpdatePassword from '../_components/dash/settings/UpdatePassword';
import UpdateUsername from '../_components/dash/settings/UpdateUsername';
import PlayDoom from '../_components/main/PlayDoom';
import PlayLocal from '../_components/main/PlayLocal';
import PlayPong from '../_components/main/PlayPong';
import PlayTournament from '../_components/main/PlayTournament';
import Footer from '../_components/mini/Footer';
import Header from '../_components/mini/Header';
import TitleSubTitle from '../_components/mini/TitleSubTitle';
import Username from '../_components/mini/Username';
import { baseMetadata, mainAppMetadata } from '../_service/consts';
import UpdateTFA from '../_components/dash/settings/UpdateTFA';

export const metadata: Metadata = {
	...baseMetadata,
	...mainAppMetadata.dashboard,
};

const Dashboard: React.FC<unknown> = () => {
	return (
		<>
			<Header />
			<div className="max-w-[1000px] mx-auto my-4 px-4">
				<Tabs.Root defaultValue="playground">
					<Tabs.List>
						<Tabs.Trigger value="playground">
							<Text className="p-4">playground</Text>
						</Tabs.Trigger>
						<Tabs.Trigger value="user">
							<Text className="p-4">User Settings</Text>
						</Tabs.Trigger>
						<Tabs.Trigger value="account">
							<Text className="p-4">Account Settings</Text>
						</Tabs.Trigger>
					</Tabs.List>

					<Box pt="3">
						<Tabs.Content value="playground">
							<TitleSubTitle subtitle="Welcome to YingYangPong, the ultimate hub for ping pong enthusiasts! Take part in thrilling ping pong matches and test your luck and strategy with exciting Doom Cards games. Chat with friends, add new players to your network, track live matches, join tournaments, climb the leaderboards, and enjoy a community built for fun, competition, and social connection. Grab your paddle, your cards, and get ready for action!">
								Welcome <Username />
							</TitleSubTitle>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<PlayPong />
								<PlayDoom />
								<PlayTournament />
								<PlayLocal />
							</div>
						</Tabs.Content>

						<Tabs.Content value="user">
							<TitleSubTitle subtitle="Basic details that will be a representation of yourself across the YingYangPong playground.">
								User Settings
							</TitleSubTitle>
							<UpdateAvatar />
							<UpdateUsername />
							<UpdateBio />
						</Tabs.Content>

						<Tabs.Content value="account">
							<TitleSubTitle subtitle="This is your personal space to control how your account works. Adjust your security settings and manage who you interact with.">
								Account Settings
							</TitleSubTitle>
							<UpdatePassword />
							<UpdateTFA />
							<Blocked />
						</Tabs.Content>
					</Box>
				</Tabs.Root>
			</div>
			<Footer />
		</>
	);
};

export default Dashboard;
