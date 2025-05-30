import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { useContext, useEffect, useRef, useState } from 'react';
import { EngageMessage, Frame, rescaleFrame, WS, WSC, wsContext } from '../Hooks/ws-client';
import { useNavigate, useParams } from 'react-router-dom';

const Server: React.FC<unknown> = () => {
	// * Parameters
	const { game } = useParams();

	const { score, frame, send, hash, won, lost, reset } = useContext(wsContext);
	const ref = useRef<HTMLDivElement>(null);
	const [f, setF] = useState<Frame>(frame);

	const navigate = useNavigate();

	function keyUp(e: KeyboardEvent) {
		e.preventDefault();
		if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
			send(WS.HookMessage(WSC.username, hash, false, false));
		}
	}
	function keyDown(e: KeyboardEvent) {
		e.preventDefault();
		if (e.code === 'ArrowUp') {
			send(WS.HookMessage(WSC.username, hash, true, false));
		} else if (e.code === 'ArrowDown') {
			send(WS.HookMessage(WSC.username, hash, false, true));
		}
	}

	useEffect(function () {
		send(EngageMessage(WSC.username, hash, game ? game : '')); // ! needs more thinking
		document.addEventListener('keyup', keyUp);
		document.addEventListener('keydown', keyDown);
		return () => {
			document.removeEventListener('keyup', keyUp);
			document.removeEventListener('keydown', keyDown);
		};
	}, []);

	useEffect(
		function () {
			if (ref.current) {
				setF(rescaleFrame(frame, ref.current.clientWidth, ref.current.clientHeight));
			}
		},
		[frame]
	);

	return (
		<>
			<Flex justify="center" my="3">
				<Text size="9" weight="bold">
					{score[1]}
				</Text>
				<Box width="100px"></Box>
				<Text size="9" weight="bold">
					{score[0]}
				</Text>
			</Flex>
			<div className="parent">
				<div className="div1"></div>
				<div ref={ref} className="div2 bg-amber-500/10 border-1 border-white rounded-4xl aspect-[4/3] relative overflow-hidden">
					{won ? (
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
					) : (
						''
					)}
					{lost ? (
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
					) : (
						''
					)}
					{!lost && !won ? (
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
					) : (
						''
					)}
				</div>
				<div className="div3"></div>
			</div>
		</>
	);
};

export default Server;
