import { Box, Grid, Tabs } from '@radix-ui/themes';
import React from 'react';
import DeleteAccount from '../_components/DeleteAccount';
import UpdateAvatar from '../_components/UpdateAvater';
import UpdateUsername from '../_components/UpdateUsername';
import UpdateBio from '../_components/UpdateBio';
import UpdatePassword from '../_components/UpdatePassword';
import PlayDoom from '../_components/dash/PlayDoom';
import PlayPong from '../_components/dash/PlayPong';
import PlayLocal from '../_components/dash/PlayLocal';
import PlayTournament from '../_components/dash/PlayTournament';
import TitleSubTitle from '../_components/dash/TitleSubTitle';
import Username from '../_components/Username';

const Dashboard: React.FC<unknown> = () => {
	return (
		<div className="max-w-[1000px] mx-auto my-4">
			<Tabs.Root defaultValue="playground">
				<Tabs.List>
					<Tabs.Trigger value="playground">playground</Tabs.Trigger>
					<Tabs.Trigger value="user">User Settings</Tabs.Trigger>
					<Tabs.Trigger value="account">Account Settings</Tabs.Trigger>
				</Tabs.List>

				<Box pt="3">
					<Tabs.Content value="playground">
						<TitleSubTitle subtitle="This is your YingYangPong playground.">
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
	);
};

export default Dashboard;
