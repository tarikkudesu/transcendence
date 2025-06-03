import { useContext, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Flex, Spinner, Text } from '@radix-ui/themes';
import { ClientPong, EngageMessage, rescaleFrame, WS, WSC, wsContext } from '../Hooks/ws-client';

export const Lost: React.FC<unknown> = () => {
	const navigate = useNavigate();
	const { reset } = useContext(wsContext);
	return (
		<Flex direction="column" align="center" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<Text size="7" weight="bold" mb="3">
				🖕 YOU LOST 🖕
			</Text>
			<Button
				onClick={() => {
					navigate(-1);
					reset();
				}}
			>
				Back To The Pool
			</Button>
		</Flex>
	);
};
export const Won: React.FC<unknown> = () => {
	const navigate = useNavigate();
	const { reset } = useContext(wsContext);

	return (
		<Flex direction="column" align="center" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<Text size="7" weight="bold" mb="3">
				🎉 YOU WON 🎉
			</Text>
			<Button
				onClick={() => {
					navigate(-1);
					reset();
				}}
			>
				Back To The Pool
			</Button>
		</Flex>
	);
};
export const Stop: React.FC<unknown> = () => {
	const navigate = useNavigate();
	const { reset } = useContext(wsContext);

	return (
		<Flex direction="column" align="center" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<Text size="7" weight="bold" mb="3">
				Opponent Left The Room
			</Text>
			<Button
				onClick={() => {
					navigate(-1);
					reset();
				}}
			>
				Back To The Pool
			</Button>
		</Flex>
	);
};
export const Start: React.FC<unknown> = () => {
	return (
		<Flex direction="column" align="center" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<Text size="3" weight="bold" mb="3">
				Waiting For Opponent To Connect
			</Text>
			<Spinner />
		</Flex>
	);
};

interface GameFrameElementProps {
	f: ClientPong;
}
const GameFrameElement: React.FC<GameFrameElementProps> = ({ f }) => {
	console.log(f);
	return (
		<>
			<div
				className="bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80"
				style={{ width: 2, height: '100%' }}
			></div>
			<div
				className="border-2 border-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80"
				style={{ height: 100, width: 100 }}
			></div>
			<Box
				className="bg-teal-600 absolute rounded-tr-md rounded-br-md border-l-1 border-white"
				style={{
					width: f.paddleRadius * 2,
					height: f.paddleHeight,
					top: f.leftPaddlePosY - f.paddleHeight / 2,
					left: f.leftPaddlePosX - f.paddleRadius,
				}}
			></Box>
			<Box
				className="bg-white absolute rounded-full"
				style={{
					width: f.ballRadius * 2,
					height: f.ballRadius * 2,
					top: f.ballY - f.ballRadius,
					left: f.ballX - f.ballRadius,
				}}
			></Box>
			<Box
				className="bg-orange-600 absolute rounded-tl-md rounded-bl-md border-r-1 border-white"
				style={{
					width: f.paddleRadius * 2,
					height: f.paddleHeight,
					top: f.rightPaddlePosY - f.paddleHeight / 2,
					left: f.rightPaddlePosX - f.paddleRadius,
				}}
			></Box>
		</>
	);
};

const Server: React.FC<unknown> = () => {
	const { send, hash, pong } = useContext(wsContext);

	const navigate = useNavigate();
	const { game } = useParams();
	const ref = useRef<HTMLDivElement>(null);

	function keyUp(e: KeyboardEvent) {
		e.preventDefault();
		if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
			send(WS.HookMessage(WSC.username, hash, 'pong', game ? game : '', false, false));
		}
	}
	function keyDown(e: KeyboardEvent) {
		e.preventDefault();
		if (e.code === 'ArrowUp') {
			send(WS.HookMessage(WSC.username, hash, 'pong', game ? game : '', true, false));
		} else if (e.code === 'ArrowDown') {
			send(WS.HookMessage(WSC.username, hash, 'pong', game ? game : '', false, true));
		}
	}

	useEffect(function () {
		if (game) send(EngageMessage(WSC.username, hash, 'pong', game ? game : '')); // ! needs more thinking
		else navigate(-1);
		document.addEventListener('keyup', keyUp);
		document.addEventListener('keydown', keyDown);
		return () => {
			document.removeEventListener('keyup', keyUp);
			document.removeEventListener('keydown', keyDown);
		};
	}, []);

	function Content(): React.ReactNode {
		if (pong.stop) return <Stop />;
		if (pong.won) return <Won />;
		if (pong.lost) return <Lost />;
		if (!pong.start) return <Start />;
		if (ref.current) return <GameFrameElement f={rescaleFrame(pong, ref.current.clientWidth, ref.current.clientHeight)} />;
	}

	return (
		<>
			<Flex justify="center" my="3">
				<Text size="9" weight="bold">
					{pong.playerScore}
				</Text>
				<Box width="100px"></Box>
				<Text size="9" weight="bold">
					{pong.opponentScore}
				</Text>
			</Flex>
			<div className="parent">
				<div className="div1"></div>
				<div ref={ref} className="div2 bg-amber-500/10 border-1 border-white rounded-4xl aspect-[4/3] relative overflow-hidden">
					{Content()}
				</div>
				<div className="div3"></div>
			</div>
		</>
	);
};

export default Server;
