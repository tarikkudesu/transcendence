import React, { useEffect, useRef, useState } from 'react';
import { Frame } from '../protocole/ws-client.js';

interface CanvasProps {
	height: number;
	width: number;
	frame: Frame;
}

export const Canvas: React.FC<CanvasProps> = ({ height, width, frame }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

	useEffect(function () {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const context = canvas.getContext('2d');
		if (!context) return;
		context.fillStyle = 'white';
		setCtx(context);
	}, []);

	function drawRightPaddle() {
		if (!canvasRef.current || !ctx) return;
		ctx.beginPath();
		ctx.arc(frame.rightPaddleTopX, frame.rightPaddleTopY, frame.paddleRadius, Math.PI, 2 * Math.PI);
		ctx.arc(frame.rightPaddleBottomX, frame.rightPaddleBottomY, frame.paddleRadius, 2 * Math.PI, Math.PI);
		ctx.closePath();
		ctx.moveTo(frame.rightPaddleTopX, frame.rightPaddleTopY);
		ctx.lineTo(frame.rightPaddleBottomX, frame.rightPaddleBottomY);
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.fillStyle = 'black';
		ctx.fill();
	}
	function drawleftPaddle() {
		if (!canvasRef.current || !ctx) return;
		ctx.beginPath();
		ctx.arc(frame.leftPaddleTopX, frame.leftPaddleTopY, frame.paddleRadius, Math.PI, 2 * Math.PI);
		ctx.arc(frame.leftPaddleBottomX, frame.leftPaddleBottomY, frame.paddleRadius, 2 * Math.PI, Math.PI);
		ctx.closePath();
		ctx.moveTo(frame.leftPaddleTopX, frame.leftPaddleTopY);
		ctx.lineTo(frame.leftPaddleBottomX, frame.leftPaddleBottomY);
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.fillStyle = 'black';
		ctx.fill();
	}
	function drawBall() {
		if (!canvasRef.current || !ctx) return;
		ctx.beginPath();
		ctx.arc(frame.ballX, frame.ballY, frame.ballRadius, 0, 2 * Math.PI);
		ctx.strokeStyle = '#060d17';
		ctx.stroke();
		ctx.fillStyle = '#060d17';
		ctx.fill();
		ctx.closePath();
	}
	function drawSeperator() {
		if (!canvasRef.current || !ctx) return;
		ctx.beginPath();
		ctx.arc(width / 2, 10, 5, Math.PI, 2 * Math.PI);
		ctx.arc(width / 2, height - 10, 5, 2 * Math.PI, Math.PI);
		ctx.closePath();
		ctx.moveTo(width / 2, 10);
		ctx.lineTo(width / 2, height - 10);
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.fillStyle = 'black';
		ctx.fill();
	}
	if (canvasRef.current && ctx) {
		ctx.clearRect(0, 0, 800, 600);
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, 800, 600);
		drawSeperator();
		drawRightPaddle();
		drawleftPaddle();
		drawBall();
	}
	return <canvas ref={canvasRef} width={width} height={height} tabIndex={0} className="rounded-sm p-4 mx-auto"></canvas>;
};
