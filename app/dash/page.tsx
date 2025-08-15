import { Box, Grid, Tabs } from '@radix-ui/themes';
import React from 'react';
import PlayDoom from '../_components/dash/PlayDoom';
import PlayLocal from '../_components/dash/PlayLocal';
import PlayPong from '../_components/dash/PlayPong';
import PlayTournament from '../_components/dash/PlayTournament';
import TitleSubTitle from '../_components/dash/TitleSubTitle';
import DeleteAccount from '../_components/DeleteAccount';
import UpdateAvatar from '../_components/UpdateAvater';
import UpdateBio from '../_components/UpdateBio';
import UpdatePassword from '../_components/UpdatePassword';
import UpdateUsername from '../_components/UpdateUsername';
import Username from '../_components/Username';
import Header from '../_components/Header';
import Footer from '../_components/Footer';
import { Text } from '@radix-ui/themes';

const Dashboard: React.FC<unknown> = () => {
	return (
		<>
			<Header />
			<div className="max-w-[1000px] mx-auto my-4">
				<Tabs.Root defaultValue="playground">
					<Tabs.List>
						<Tabs.Trigger value="playground">
							<Text className="p-4">playground</Text>
						</Tabs.Trigger>
						<Tabs.Trigger value="user">User Settings</Tabs.Trigger>
						<Tabs.Trigger value="account">Account Settings</Tabs.Trigger>
					</Tabs.List>

					<Box pt="3">
						<Tabs.Content value="playground">
							<TitleSubTitle subtitle="Welcome to YingYangPong, the ultimate hub for ping pong enthusiasts! Take part in thrilling ping pong matches and test your luck and strategy with exciting Doom Cards games. Chat with friends, add new players to your network, track live matches, join tournaments, climb the leaderboards, and enjoy a community built for fun, competition, and social connection. Grab your paddle, your cards, and get ready for action!">
								Welcome <Username />
							</TitleSubTitle>
							<Grid columns="2" gap="6">
								<PlayPong />
								<PlayLocal />
								<PlayTournament />
								<PlayDoom />
							</Grid>
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
							<TitleSubTitle subtitle="Delete your account, reset your password">Account Settings</TitleSubTitle>
							<UpdatePassword />
							<DeleteAccount />
						</Tabs.Content>
					</Box>
				</Tabs.Root>
			</div>
			<Footer />
		</>
	);
};

export default Dashboard;
