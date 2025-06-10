import { useContext, useState } from 'react';
import { Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Card, Grid, TextField, Text, Box, Avatar, Flex, Button, Inset, Badge } from '@radix-ui/themes';
import { AcceptMessage, ClientInvitation, ClientPlayer, DeleteMessage, InviteMessage, RejectMessage, WSC, wsContext } from '../Hooks/ws-client';

interface PlayerCardProps {
	pooler: ClientPlayer;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ pooler }) => {
	const { send, hash } = useContext(wsContext);

	function inviteAction(game: 'pong' | 'card of doom'): React.ReactNode {
		if (pooler.playerStatus === 'playing') return <Button disabled>{game}</Button>;
		if (pooler.inviteStatus === 'unsent') return <Button onClick={() => send(InviteMessage(WSC.username, hash, game, pooler.username))}>{game}</Button>;
		if (game !== pooler.game) return <Button disabled>{game}</Button>;
		else if (pooler.inviteStatus === 'pending') return <Button loading>{game}</Button>;
		else if (pooler.inviteStatus === 'declined') return <Button disabled>{game}</Button>;
	}

	function inviteStatus(): React.ReactNode {
		if (pooler.inviteStatus === 'pending')
			return (
				<Badge size="1" color="blue">
					{pooler.inviteStatus}
				</Badge>
			);
		else if (pooler.inviteStatus === 'declined')
			return (
				<Badge size="1" color="red">
					{pooler.inviteStatus}
				</Badge>
			);
		else if (pooler.inviteStatus === 'accepted')
			return (
				<Badge size="1" color="green">
					{pooler.inviteStatus}
				</Badge>
			);
		return;
	}

	return (
		<Card>
			<Flex gap="2" justify="between">
				<Flex align="center" justify="start" gap="3">
					<Avatar style={{ borderColor: pooler.playerStatus === 'free' ? 'green' : 'orange' }} className="border-2 p-0.5" size="3" src="/src/assets/profile.png" radius="full" fallback="T" />
					<Box>
						<Text mr="2" size="2" weight="bold">
							{pooler.username}
						</Text>
						{inviteStatus()}
					</Box>
				</Flex>
				<Flex align="center" gap="2">
					{inviteAction('pong')}
					{inviteAction('card of doom')}
				</Flex>
			</Flex>
		</Card>
	);
};

interface InvitationCardProps {
	invite: ClientInvitation;
}
const InvitationCard: React.FC<InvitationCardProps> = ({ invite }) => {
	const { send, hash } = useContext(wsContext);

	return (
		<Card>
			<Inset clip="padding-box" side="top" pb="current" className="relative">
				<Box height="120px"></Box>
				<Flex direction="column" align="center" className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
					<div style={{ height: 90, width: 90 }} className="border-2 border-orange-500/80 rounded-full flex justify-center items-center">
						<div style={{ height: 80, width: 80 }} className="border-2 border-orange-500/60 rounded-full flex justify-center items-center">
							<div style={{ height: 70, width: 70 }} className="border-2 border-orange-500/40 rounded-full flex justify-center items-center">
								<div style={{ height: 60, width: 60 }} className="border-2 border-orange-500/20 rounded-full flex justify-center items-center">
									<Avatar size="4" src="/src/assets/profile.png" radius="full" fallback="T" />
								</div>
							</div>
						</div>
					</div>
				</Flex>
				{invite.inviteStatus !== 'pending' ? (
					<Box className="absolute top-2 right-2 p-1 opacity-50 hover:opacity-100" onClick={() => send(DeleteMessage(WSC.username, hash, invite.game, invite.sender))}>
						<Cross2Icon />
					</Box>
				) : (
					''
				)}
			</Inset>
			<Text align="center" as="div" size="1" weight="bold" className="opacity-80">
				<Text style={{ color: 'var(--accent-10)' }}>{invite.sender}</Text> invited you to play{' '}
				<Text style={{ color: 'var(--accent-9)' }} weight="bold">
					{invite.game}
				</Text>
			</Text>
			<Box height="24px" />
			<Flex justify="center">
				<Button disabled={invite.inviteStatus !== 'pending'} size="1" onClick={() => send(AcceptMessage(WSC.username, hash, invite.game, invite.sender))} style={{ width: '100%' }}>
					Accept
				</Button>
			</Flex>
			<Box height="8px" />
			<Flex justify="center">
				<Button
					variant="soft"
					size="1"
					onClick={() => send(RejectMessage(WSC.username, hash, invite.game, invite.sender))}
					style={{ width: '100%' }}
					disabled={invite.inviteStatus !== 'pending'}
				>
					Reject
				</Button>
			</Flex>
		</Card>
	);
};

const Main: React.FC<unknown> = () => {
	const [query, setQuery] = useState<string>('');
	const { pool, invitations } = useContext(wsContext);

	return (
		<>
			<div className="max-w-300 mx-auto px-12">
				<Grid columns={{ initial: '1', md: '3' }} gap="3">
					<Card>
						<TextField.Root value={query} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} placeholder="Search the pool" className="outline-none">
							<TextField.Slot>
								<MagnifyingGlassIcon height="16" width="16" />
							</TextField.Slot>
						</TextField.Root>
						<Box height="12px" />
						{pool.length === 0 ? (
							<Text as="div" size="1" align="center" className="opacity-75">
								This pool is empty
							</Text>
						) : (
							<>
								<Text as="div" size="1" align="center" className="opacity-95">
									This pool has {pool.length} online players
								</Text>
								<Box height="12px" />
								<Flex direction="column" gap="2">
									{pool.map((pooler, index) => {
										// if (query.length === 0) return;
										// if (query.toLowerCase() === pooler.username.slice(0, query.length).toLowerCase())
										return <PlayerCard pooler={pooler} key={index} />;
									})}
								</Flex>
							</>
						)}
					</Card>
					<Card>
						{invitations.length === 0 ? (
							<Text as="div" size="1" align="center" className="opacity-75">
								This pool is empty
							</Text>
						) : (
							<Grid gap="4" columns={{ initial: '2', sm: '3' }}>
								{invitations.map((invite, index) => (
									<InvitationCard invite={invite} key={index} />
								))}
							</Grid>
						)}
					</Card>
					<Card>
						<Card>
							<img
								src="/src/assets/Tournament.png"
								className="aspect-square"
								alt="Tournament"
								style={{
									objectFit: 'cover',
									display: 'block',
									width: '100%',
								}}
							/>
							<Flex className="flex-grow" justify="between" align="end">
								<Box>
									<Text as="div" size="3" weight="bold">
										Big Donkey
									</Text>
									<Text as="div" size="1" className="opacity-75">
										will open at 15:56
									</Text>
									{/* <Text as="div" size="1" className="opacity-75">
										7 empty slots
									</Text> */}
								</Box>
								<Button>Register</Button>
							</Flex>
						</Card>
						
					</Card>
				</Grid>
			</div>
		</>
	);
};

export default Main;
