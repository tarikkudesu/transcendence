import { Avatar, Badge, Box, Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import { ConnectMessage, WSC, wsContext } from '../Hooks/ws-client';
import { useContext, useState, type ChangeEvent } from 'react';

const Home: React.FC<unknown> = () => {
	const { error, open, close, send } = useContext(wsContext);
	const [username, setUsername] = useState<string>(WSC.username);

	function content() {
		if (error)
			return (
				<Badge color="red" variant="soft" radius="full">
					Error
				</Badge>
			);
		if (close)
			return (
				<Badge color="yellow" variant="soft" radius="full">
					Closed
				</Badge>
			);
		if (open)
			return (
				<Badge color="jade" variant="soft" radius="full">
					Open
				</Badge>
			);
		return (
			<Badge color="red" variant="soft" radius="full">
				Disconnected
			</Badge>
		);
	}
	return (
		<>
			<Box height="24px" />
			<Flex justify="between" className="px-12">
				<Text as="div" align="center" size="3" weight="bold">
					PONG
				</Text>
				<Flex align="center" gap="4">
					<Text size="1" weight="bold" className="opacity-80">
						{WSC.username}
					</Text>
					<Avatar size="2" src="/src/assets/profile.png" radius="full" fallback="T" className="border-2 p-0.5" style={{ borderColor: 'var(--accent-10)' }} />
				</Flex>
			</Flex>
			<Dialog.Root>
				<Flex justify="center">
					<Dialog.Trigger>
						<Button>Edit profile</Button>
					</Dialog.Trigger>
				</Flex>

				<Dialog.Content maxWidth="450px">
					<Dialog.Title>Edit profile</Dialog.Title>
					<Dialog.Description size="2" mb="4">
						Make changes to your profile.
					</Dialog.Description>

					<Flex direction="column" gap="3">
						<label>
							<Text as="div" size="2" mb="1" weight="bold">
								username
							</Text>
							<TextField.Root defaultValue={username} placeholder="Enter your username" onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
						</label>
					</Flex>
					<Flex gap="3" mt="4" justify="end">
						<Dialog.Close>
							<Button variant="soft" color="gray">
								Cancel
							</Button>
						</Dialog.Close>
						<Dialog.Close>
							<Button
								disabled={username === ''}
								onClick={() => {
									WSC.username = username;
									send(ConnectMessage(username, ''));
								}}
							>
								Save
							</Button>
						</Dialog.Close>
					</Flex>
				</Dialog.Content>
			</Dialog.Root>

			<div className="fixed right-4 bottom-4">{content()}</div>
			<Box height="24px" />
			<Outlet />
		</>
	);
};
export default Home;
