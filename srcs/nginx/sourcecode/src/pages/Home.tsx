import { Badge, Box, Button, Flex, IconButton, Popover, Text } from '@radix-ui/themes';
import { Outlet, useNavigate } from 'react-router-dom';
import { AcceptMessage, ClientInvitation, DeleteMessage, RejectMessage, wsContext } from '../Hooks/ws-client';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../Redux/Store';
import { BellIcon, Cross2Icon } from '@radix-ui/react-icons';
import PlayerAvatar from '../Components/PlayerAvatar';

interface InvitationCardProps {
	invite: ClientInvitation;
}
const InvitationCard: React.FC<InvitationCardProps> = ({ invite }) => {
	const { send, hash } = useContext(wsContext);
	const username: string = useSelector((state: RootState) => state.user.username);

	return (
		<Flex justify="between" align="center" my="4">
			<Text align="center" as="div" size="1" weight="bold" className="opacity-80">
				<Text style={{ color: 'var(--accent-10)' }}>{invite.sender}</Text> invited you to play{' '}
				<Text style={{ color: 'var(--accent-9)' }} weight="bold">
					{invite.game}
				</Text>
			</Text>
			{invite.inviteStatus !== 'pending' ? (
				<Box className="absolute top-2 right-2 p-1 opacity-50 hover:opacity-100" onClick={() => send(DeleteMessage(username, hash, invite.game, invite.sender))}>
					<Cross2Icon />
				</Box>
			) : (
				<Flex justify="end" align="center" gap="2">
					<Button size="1" onClick={() => send(AcceptMessage(username, hash, invite.game, invite.sender))}>
						Accept
					</Button>
					<Button variant="soft" size="1" onClick={() => send(RejectMessage(username, hash, invite.game, invite.sender))}>
						Reject
					</Button>
				</Flex>
			)}
		</Flex>
	);
};

const Home: React.FC<unknown> = () => {
	const navigate = useNavigate();
	const { error, open, close, hash, invitations } = useContext(wsContext);
	const username: string = useSelector((state: RootState) => state.user.username);

	useEffect(() => {
		if (!username) navigate('/');
	}, [navigate, username]);

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
			{hash && username && (
				<>
					<Flex justify="between" className="px-12">
						<Flex align="center" gap="4">
							<Text as="div" align="center" size="3" weight="bold">
								PONG
							</Text>
						</Flex>
						<Flex align="center" gap="4">
							<Popover.Root>
								<Popover.Trigger>
									<IconButton radius="full" variant="soft" color={invitations.length === 0 ? 'teal' : 'amber'}>
										<BellIcon />
									</IconButton>
								</Popover.Trigger>
								<Popover.Content width="400px">
									{invitations.length === 0 ? (
										<Text as="div" size="1" align="center" className="opacity-75">
											You have No invitations
										</Text>
									) : (
										<>
											{invitations.map((invite, index) => (
												<InvitationCard invite={invite} key={index} />
											))}
										</>
									)}
								</Popover.Content>
							</Popover.Root>
							<PlayerAvatar username={username} />
							{/* <Avatar size="2" src="/assets/profile.png" radius="full" fallback="T" className="border-2 p-0.5" style={{ borderColor: 'var(--accent-10)' }} /> */}
						</Flex>
					</Flex>
					<Box height="24px" />
					<Text size="7" weight="bold" className="opacity-80 px-12">
						Welcome {username}
					</Text>
				</>
			)}
			<div className="fixed right-4 bottom-4">{content()}</div>
			<Box height="24px" />
			<Outlet />
		</>
	);
};
export default Home;
