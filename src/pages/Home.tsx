import { Avatar, Badge, Box, Button, Flex, Text } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import { WSC, wsContext } from '../Hooks/ws-client';
import { useContext, useState } from 'react';

const Home: React.FC<unknown> = () => {
	const { error, open, close } = useContext(wsContext);

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
	const [pingit, setPingit] = useState<string>('PING');
	async function ping() {
		console.log(document.cookie);
		const res = await fetch('/ws/ping', {
			method: 'GET',
			headers: {
				cookie: document.cookie,
			},
			credentials: 'include',
		});
		if (res.ok) setPingit('PONG');
		else setPingit('NOT PONG');
	}
	return (
		<>
			<Box height="24px" />
			<Flex justify="between" className="px-12">
				<Flex align="center" gap="4">
					<Text as="div" align="center" size="3" weight="bold">
						PONG
					</Text>
					<Button onClick={ping}>{pingit}</Button>
				</Flex>
				<Flex align="center" gap="4">
					<Text size="1" weight="bold" className="opacity-80">
						{WSC.username}
					</Text>
					<Avatar size="2" src="/assets/profile.png" radius="full" fallback="T" className="border-2 p-0.5" style={{ borderColor: 'var(--accent-10)' }} />
				</Flex>
			</Flex>
			<div className="fixed right-4 bottom-4">{content()}</div>
			<Box height="24px" />
			<Outlet />
		</>
	);
};
export default Home;
