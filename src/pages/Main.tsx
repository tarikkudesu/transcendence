import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Card, Grid, TextField, Text, Box, Avatar, Flex, Button } from '@radix-ui/themes';
import { useContext, useEffect, useState } from 'react';
import { SocketConnectionContext } from '../Hooks/useTeaWebsocket';
import { Invitation, Invitations, Message, Pool, Pooler, WS, WSC } from '../Hooks/ws-client';

interface PlayerCardProps {
	pooler: Pooler;
}
const PlayerCard: React.FC<PlayerCardProps> = ({ pooler }) => {
	const { send } = useContext(SocketConnectionContext);

	return (
		<Card>
			<Flex gap="2" justify="between">
				<Flex align="center" justify="start" gap="3">
					<Avatar size="3" src={pooler.img} radius="full" fallback="T" />
					<Box>
						<Text as="div" size="2" weight="bold">
							{pooler.username}
						</Text>
						<Text as="div" size="2" color="gray">
							{pooler.invite_status}
						</Text>
					</Box>
				</Flex>
				<Flex align="center">
					<Button onClick={() => send(WS.InviteMessage(WSC.username, pooler.username))}>Invite</Button>
				</Flex>
			</Flex>
		</Card>
	);
};

interface InvitationCardProps {
	invite: Invitation;
}
const InvitationCard: React.FC<InvitationCardProps> = ({ invite }) => {
	return (
		<Card>
			<Flex gap="2" justify="between">
				<Flex align="center" justify="start" gap="3">
					<Avatar size="3" src={invite.img} radius="full" fallback="T" />
					<Text as="div" size="2" weight="bold">
						{invite.recipient}
					</Text>
				</Flex>
				<Flex align="center">
					<Button>Accept</Button>
				</Flex>
			</Flex>
		</Card>
	);
};

const Main: React.FC<unknown> = () => {
	const [query, setQuery] = useState<string>('');
	const { data, send } = useContext(SocketConnectionContext);
	const [pool, setPool] = useState<Pooler[]>([]);
	const [invitations, setInvitations] = useState<Invitation[]>([]);

	useEffect(
		function () {
			try {
				if (data === '') throw new Error('no data');
				const message: Message = WS.Json({ message: data, target: Message.instance });
				switch (message.message) {
					case 'POOL': {
						const p: Pool = WS.Json({ message: message.data, target: Pool.instance });
						setPool(p.pool);
						break;
					}
					case 'INVITATIONS': {
						const i: Invitations = WS.Json({ message: message.data, target: Invitations.instance });
						setInvitations(i.invitations);
						break;
					}
					default:
						break;
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				return;
			}
		},
		[data]
	);
	return (
		<>
			<div className="w-300 mx-auto">
				<Grid columns="2" gap="3">
					<Card>
						<TextField.Root
							value={query}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
							placeholder="Search the pool"
							className="outline-none"
						>
							<TextField.Slot>
								<MagnifyingGlassIcon height="16" width="16" />
							</TextField.Slot>
						</TextField.Root>
						<Box height="12px" />
						<Flex direction="column" gap="2">
							{pool.length === 0 ? (
								<Text as="div" size="1" align="center" className="opacity-75">
									This pool is empty
								</Text>
							) : (
								pool.map((pooler, index) => <PlayerCard pooler={pooler} key={index} />)
							)}
						</Flex>
					</Card>
					<Card>
						<Flex direction="column" gap="2">
							{invitations.length === 0 ? (
								<Text as="div" size="1" align="center" className="opacity-75">
									This pool is empty
								</Text>
							) : (
								invitations.map((invite, index) => <InvitationCard invite={invite} key={index} />)
							)}
						</Flex>
					</Card>
				</Grid>
			</div>
		</>
	);
};

export default Main;
