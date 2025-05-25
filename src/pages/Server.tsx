import { Box, Flex, Text } from '@radix-ui/themes';
import { useContext, useEffect } from 'react';
import { WS, WSC, wsContext } from '../Hooks/ws-client';

const Server: React.FC<unknown> = () => {
	const { score, frame, send, hash } = useContext(wsContext);

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
		document.addEventListener('keyup', keyUp);
		document.addEventListener('keydown', keyDown);
		return () => {
			document.removeEventListener('keyup', keyUp);
			document.removeEventListener('keydown', keyDown);
		};
	});

	return (
		<>
			<Flex justify="center" my="3">
				<Text size="9" weight="bold">
					{score[0]}
				</Text>
				<Box width="100px"></Box>
				<Text size="9" weight="bold">
					{score[1]}
				</Text>
			</Flex>
			<div style={{ width: '1000px', height: '1000px' }} className="mx-auto relative bg-amber-600/10 rounded-xl">
				<Box
					className="bg-amber-600 absolute rounded-full"
					style={{
						width: frame.paddleRadius * 2,
						height: frame.paddleHeight,
						top: frame.leftPaddlePosY - frame.paddleHeight / 2,
						left: frame.leftPaddlePosX - frame.paddleRadius,
					}}
					height="100px"
				></Box>
				<Box
					className="bg-amber-600 absolute rounded-full"
					style={{
						width: frame.ballRadius * 2,
						height: frame.ballRadius * 2,
						top: frame.ballY - frame.ballRadius,
						left: frame.ballX - frame.ballRadius,
					}}
				></Box>
				<Box
					className="bg-amber-600 absolute rounded-full"
					style={{
						width: frame.paddleRadius * 2,
						height: frame.paddleHeight,
						top: frame.rightPaddlePosY - frame.paddleHeight / 2,
						left: frame.rightPaddlePosX - frame.paddleRadius,
					}}
					height="100px"
				></Box>
			</div>
		</>
	);
};

export default Server;
