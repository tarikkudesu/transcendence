import { useEffect, useRef, useState } from 'react';
import { Pong } from './game/Pong';
import Button from './Components/button';

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
		<div className="text-gray-400 text-center my-4">
			PING PONG
			<canvas
				style={{
					border: '1px solid #363a3f67',
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
		</div>
	);
}

export default App;
