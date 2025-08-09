import { Avatar, Badge, Box, Button, Callout, Heading, IconButton, Popover, Spinner, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { InviteMessage, useWebSocket, type ClientPlayer } from '../Hooks';
import { HTTP_API } from '../services/API';
import { useAuth } from '../Hooks/AuthContext';

interface PlayerSummaryProps {
	username: string;
}

const PlayerPongSummary: React.FC<PlayerSummaryProps> = ({ username }) => {
	const { token } = useAuth();
	const { data, error, isPending } = useQuery({
		queryKey: [username + 'pongsummary'],
		queryFn: () =>
			fetch(`${HTTP_API}/game/doom/summary/${username}`, {
				credentials: 'include',
				headers: {
					Cookie: token,
				},
			}).then((res) => res.json()),
	});
	console.log(data);
	return (
		<div className="mb-4">
			{isPending && (
				<div className="flex justify-center">
					<Spinner />
				</div>
			)}
			{error && (
				<Callout.Root color="red">
					<Callout.Text>An error has occured</Callout.Text>
				</Callout.Root>
			)}
			{data && data.stats && (
				<div>
					<Text size="2" weight="bold">
						Pong
					</Text>
					<Text as="div" size="1" className="opacity-75">
						played a total of {data.stats.total_games} games
					</Text>
					<Text as="div" size="1" className="opacity-75">
						won {data.stats.total_winns} games
					</Text>
					<Text as="div" size="1" className="opacity-75">
						participated in a total of {data.stats.totalTournamentPlayed} tournaments
					</Text>
					<Text as="div" size="1" className="opacity-75">
						won {data.stats.totalTournamentWinns} tournaments
					</Text>
				</div>
			)}
		</div>
	);
};
const PlayerDoomSummary: React.FC<PlayerSummaryProps> = ({ username }) => {
	const { token } = useAuth();
	const { data, error, isPending } = useQuery({
		queryKey: [username + 'doomsummary'],
		queryFn: () =>
			fetch(`${HTTP_API}/game/doom/summary/${username}`, {
				credentials: 'include',
				headers: {
					Cookie: token,
				},
			}).then((res) => res.json()),
	});
	console.log(data);
	return (
		<div className="mb-4">
			{isPending && (
				<div className="flex justify-center">
					<Spinner />
				</div>
			)}
			{error && (
				<Callout.Root color="red">
					<Callout.Text>An error has occured</Callout.Text>
				</Callout.Root>
			)}
			{data && data.stats && data.stats && (
				<div>
					<Text size="2" weight="bold">
						Doom
					</Text>
					<Text as="div" size="1" className="opacity-75">
						played a total of {data.stats.total_games} games
					</Text>
					<Text as="div" size="1" className="opacity-75">
						won {data.stats.total_winns} games
					</Text>
				</div>
			)}
		</div>
	);
};
interface PlayerAvatarProps {
	username: string;
	pooler?: ClientPlayer;
}
const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ username, pooler }) => {
	const { token } = useAuth();
	const { send } = useWebSocket();
	const { data, error, isPending } = useQuery({
		queryKey: [username],
		queryFn: () =>
			fetch(`${HTTP_API}/users/${username}`, {
				credentials: 'include',
				headers: {
					Cookie: token,
				},
			}).then((res) => res.json()),
	});

	function inviteAction(game: 'pong' | 'card of doom'): React.ReactNode {
		if (pooler?.inviteStatus === 'unsent')
			return (
				<Button mr="2" disabled={pooler?.inviteStatus !== 'unsent'} onClick={() => send(InviteMessage(game, pooler?.username))}>
					{game}
				</Button>
			);
		if (game !== pooler?.game)
			return (
				<Button mr="2" disabled>
					{game}
				</Button>
			);
		else if (pooler?.inviteStatus === 'pending')
			return (
				<Button mr="2" loading>
					{game}
				</Button>
			);
		else if (pooler?.inviteStatus === 'declined')
			return (
				<Button mr="2" disabled>
					{game}
				</Button>
			);
	}

	function inviteStatus(): React.ReactNode {
		if (pooler?.inviteStatus === 'pending')
			return (
				<Badge size="1" color="blue">
					{pooler?.inviteStatus}
				</Badge>
			);
		else if (pooler?.inviteStatus === 'declined')
			return (
				<Badge size="1" color="red">
					{pooler?.inviteStatus}
				</Badge>
			);
		else if (pooler?.inviteStatus === 'accepted')
			return (
				<Badge size="1" color="green">
					{pooler?.inviteStatus}
				</Badge>
			);
		return;
	}

	return (
		<Box m="2">
			<Popover.Root>
				<Popover.Trigger>
					<IconButton radius="full" variant="soft" className="cursor-pointer">
						{isPending || error ? (
							<Spinner />
						) : (
							<Avatar
								size="3"
								radius="full"
								draggable={false}
								src={data.avatar}
								fallback={username[0] ?? 'T'}
								className="border-2 p-0.5"
								style={{ borderColor: pooler?.playerStatus === 'playing' ? 'orange' : 'teal' }}
							/>
						)}
					</IconButton>
				</Popover.Trigger>
				<Popover.Content width="300px">
					{isPending || error ? (
						<Spinner />
					) : (
						<div className="m-3">
							<Heading size="4" mb="1">
								{username}
								{inviteStatus()}
							</Heading>
							<Text as="p" size="2" mb="4" color="gray">
								{data.bio}
							</Text>
							<PlayerPongSummary username={username} />
							<PlayerDoomSummary username={username} />
							<Box height="4" />
							{pooler && inviteAction('pong')}
							{pooler && inviteAction('card of doom')}
						</div>
					)}
				</Popover.Content>
			</Popover.Root>
		</Box>
	);
};

export default PlayerAvatar;
