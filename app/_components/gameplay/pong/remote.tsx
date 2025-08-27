'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import { useUser } from '@/app/_service/user/userContext';
import { ClientPlayer, DisconnectMessage, EngageMessage, HookMessage, InviteMessage, useGameSocket } from '@/app/_service/ws/game';
import { SvgChat, SvgGameBoy, SvgPong, SvgSoundOff, SvgSoundOn } from '@/app/_svg/svg';
import { useRouter } from 'next/navigation';
import { User } from '../../dash/game/User';
import { Disconnected, Lost, Waiting, Won } from '../Cards';
import Pong from './Pong';

const Ping: React.FC<{ sound: boolean; gid: string }> = ({ sound, gid }) => {
	const { send, pong: game } = useGameSocket();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pong: Pong = useMemo(() => {
		return new Pong();
	}, []);

	useEffect(() => {
		pong.updateSound(sound);
	}, [pong, sound]);

	pong.draw(game);

	const keyUp = useCallback(
		(e: KeyboardEvent) => {
			e.preventDefault();
			if (e.code === 'ArrowDown' || e.code === 'ArrowUp') send(HookMessage('pong', gid, false, false));
		},
		[gid, send]
	);

	const keyDown = useCallback(
		(e: KeyboardEvent) => {
			e.preventDefault();
			if (e.code === 'ArrowUp') send(HookMessage('pong', gid, true, false));
			else if (e.code === 'ArrowDown') send(HookMessage('pong', gid, false, true));
		},
		[gid, send]
	);

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		canvasRef.current?.focus();
		if (ctx) pong.setup(canvas, ctx, keyUp, keyDown);
		if (sound) {
			const audio = new Audio('/audio/arena-start.mp3');
			audio.play();
		}
		return () => {
			if (sound) {
				const audio = new Audio('/audio/arena-end.mp3');
				audio.play();
			}
			pong.clear();
		};
	}, [keyDown, keyUp, pong, sound]);

	return (
		<canvas
			width="800"
			height="600"
			tabIndex={0}
			ref={canvasRef}
			className="block focus:outline-none"
			style={{ backgroundColor: 'transparent' }}
		></canvas>
	);
};

const RemotePong: React.FC<{ gid: string; opponent: string }> = ({ gid, opponent }) => {
	const router = useRouter();
	const { username } = useUser();
	const [sound, setSound] = useState<boolean>(true);
	const { pooler: getPooler, send, pong: game, open, reset } = useGameSocket();

	const pooler: ClientPlayer | undefined = getPooler(opponent);

	useEffect(() => {
		reset();
		return () => {
			send(DisconnectMessage());
			reset();
		};
	}, [reset, send]);

	useEffect(() => {
		if (open && gid) send(EngageMessage('pong', gid));
	}, [gid, open, send]);

	const switchSound = useCallback(() => {
		setSound((state) => !state);
	}, []);

	function Content(): React.ReactNode {
		if (game.stop) return <Disconnected player={username} opponent={opponent} />;
		if (game.won)
			return (
				<Won player={username} opponent={opponent}>
					{pooler && (
						<>
							<PongButton
								onClick={() => send(InviteMessage('pong', opponent))}
								disabled={
									pooler.playerStatus === 'playing' ||
									pooler.inviteStatus === 'pending' ||
									pooler.inviteStatus === 'declined'
								}
								loading={pooler.inviteStatus === 'pending'}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black disabled:text-dark-400 disabled:bg-dark-700"
							>
								<SvgPong size={24} />
							</PongButton>
							<PongButton
								onClick={() => router.push(`/main/dashboard/chat?chatemate=${opponent}`)}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
							>
								<SvgChat size={24} />
							</PongButton>
						</>
					)}
				</Won>
			);
		if (game.lost)
			return (
				<Lost player={username} opponent={opponent}>
					{pooler && (
						<>
							<PongButton
								onClick={() => send(InviteMessage('pong', opponent))}
								disabled={
									pooler.playerStatus === 'playing' ||
									pooler.inviteStatus === 'pending' ||
									pooler.inviteStatus === 'declined'
								}
								loading={pooler.inviteStatus === 'pending'}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black disabled:text-dark-400 disabled:bg-dark-700"
							>
								<SvgPong size={24} />
							</PongButton>
							<PongButton
								onClick={() => router.push(`/main/dashboard/chat?chatemate=${opponent}`)}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
							>
								<SvgChat size={24} />
							</PongButton>
						</>
					)}
				</Lost>
			);
		if (!game.start) return <Waiting player={username} opponent={opponent} />;
		return <Ping sound={sound} gid={gid} />;
	}

	return (
		<div>
			<div className="w-[812px] mx-auto flex justify-between mb-1">
				<User.Username username={opponent} className="font-bold" />
				<div className="text-dark-300">First to 7 wins</div>
				<User.Username username={username} className="font-bold" />
			</div>
			<div className="w-[812px] bg-dark-950 aspect-[4/3] relative overflow-hidden mx-auto rounded-md border-[6px] border-accent-300 shadow-xl mb-6">
				{Content()}
			</div>
			<div className="flex justify-center items-center gap-4">
				<PongButton
					className="bg-accent-300 hover:bg-accent-200 text-black"
					onClick={() => router.push('/main/dashboard/playground')}
				>
					<SvgGameBoy size={18} />
				</PongButton>
				{sound ? (
					<PongButton className="bg-dark-500 hover:bg-dark-400" onClick={switchSound}>
						<SvgSoundOff size={18} />
					</PongButton>
				) : (
					<PongButton className="bg-dark-500 hover:bg-dark-400" onClick={switchSound}>
						<SvgSoundOn size={18} />
					</PongButton>
				)}
			</div>
		</div>
	);
};

export default RemotePong;
