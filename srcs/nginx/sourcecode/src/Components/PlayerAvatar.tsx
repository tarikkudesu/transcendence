import { Box, Popover, IconButton, Avatar, Spinner, Heading, Text, Badge, Button } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ClientPlayer, InviteMessage, wsContext } from '../Hooks/ws-client';
import { useSelector } from 'react-redux';
import type { RootState } from '../Redux/Store';

// interface Player {
// 	username: string;
// 	bio: string;
// 	avatar: string;
// }
interface PlayerAvatarProps {
	username: string;
	pooler?: ClientPlayer;
}
const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ username, pooler }) => {
	const myUsername: string = useSelector((state: RootState) => state.user.username);
	const { send, hash } = useContext(wsContext);
	const { data, error, isPending } = useQuery({ queryKey: [username], queryFn: () => fetch(`http://localhost:3004/api/${username}`).then((res) => res.json()) });

	function inviteAction(game: 'pong' | 'card of doom'): React.ReactNode {
		if (pooler?.inviteStatus === 'unsent')
			return (
				<Button mr="2" disabled={pooler?.inviteStatus !== 'unsent'} onClick={() => send(InviteMessage(myUsername, hash, game, pooler?.username))}>
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
								fallback={username}
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
							<Heading size="2" mb="1">
								{username}
								{inviteStatus()}
							</Heading>
							<Text as="p" size="2" mb="4" color="gray">
								{data.bio}
							</Text>
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
