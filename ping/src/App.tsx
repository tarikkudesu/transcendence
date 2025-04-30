import { useEffect, useRef } from 'react';
import { Pong } from './game/Pong';

import { Text, Flex, Card } from '@radix-ui/themes';

function App() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pong: Pong = new Pong();

	useEffect(function () {
		const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		canvasRef.current?.focus();
		pong.setup(canvas, ctx);
	}, []);

	return (
		<div className="h-screen py-12 overflow-hidden">
			<Text as="div" align="center" weight="bold" size="8">
				PING PONG
			</Text>
			<canvas
				style={{
					borderRadius: 12,
					display: 'block',
					margin: '40px auto',
					background: 'white',
				}}
				ref={canvasRef}
				width="800"
				height="600"
				tabIndex={0}
			></canvas>
			<div className="mx-auto" style={{ maxWidth: 800 }}>
				<Flex direction="column" justify="between" gap="3">
					<Flex justify="between" gap="3">
						<Card size="1">S</Card>
						<Card size="1">Arraw Down</Card>
					</Flex>
					<Flex justify="between" gap="3">
						<Card size="1">W</Card>
						<Card size="1">Arraw Up</Card>
					</Flex>
				</Flex>
			</div>
		</div>
	);
}

export default App;
