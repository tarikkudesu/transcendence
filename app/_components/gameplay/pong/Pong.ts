'use client';

import * as Main from './consts';

function randInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ! Vector ------------------------------------------------------------------------------------------------
class Vector {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(v: Vector): Vector {
		return new Vector(this.x + v.x, this.y + v.y);
	}

	subtr(v: Vector): Vector {
		return new Vector(this.x - v.x, this.y - v.y);
	}

	mag(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	mult(n: number): Vector {
		return new Vector(this.x * n, this.y * n);
	}

	normal(): Vector {
		return new Vector(-this.y, this.x).unit();
	}

	unit(): Vector {
		if (this.mag() === 0) return new Vector(0, 0);
		else return new Vector(this.x / this.mag(), this.y / this.mag());
	}

	static dot(v1: Vector, v2: Vector): number {
		return v1.x * v2.x + v1.y * v2.y;
	}

	static cross(v1: Vector, v2: Vector): number {
		return v1.x * v2.y - v1.y * v2.x;
	}
}

interface BallConstructor {
	direction: Vector;
}

class Ball {
	direction: Vector;
	pos: Vector;

	constructor({ direction }: BallConstructor) {
		this.direction = new Vector(0, 0);
		this.pos = new Vector(Main.PongWidth / 2, Main.PongHeight / 2);
		this.direction = direction;
	}

	reposition(): void {
		this.pos = this.pos.add(this.direction.mult(Main.BallVelocity));
	}
}

interface PaddleConstructor {
	center: Vector;
}

class Paddle {
	vel: Vector;
	acc: Vector;
	acceleration: number;
	start: Vector;
	end: Vector;
	pos: Vector;
	dir: Vector;

	constructor({ center }: PaddleConstructor) {
		this.vel = new Vector(0, 0);
		this.acc = new Vector(0, 0);
		this.acceleration = 1.8;
		this.start = new Vector(center.x, center.y - Math.ceil(Main.PaddleHeight));
		this.end = new Vector(center.x, center.y + Math.ceil(Main.PaddleHeight));
		this.pos = center;
		this.dir = this.end.subtr(this.start).unit();
	}

	move(Up: boolean, Down: boolean): void {
		if (Up) this.acc = this.dir.mult(-this.acceleration);
		if (Down) this.acc = this.dir.mult(this.acceleration);
		if (!Up && !Down) this.acc = new Vector(0, 0);
	}

	reposition(): void {
		this.acc = this.acc.unit().mult(this.acceleration);
		this.vel = this.vel.add(this.acc).mult(1 - Main.Friction);
		const newPos = this.pos.add(this.vel);
		if (newPos.y < Main.PaddleHeight) newPos.y = Main.PaddleHeight;
		if (newPos.y > Main.PongHeight - Main.PaddleHeight) newPos.y = Main.PongHeight - Main.PaddleHeight;
		this.pos = newPos;
		const length = this.end.subtr(this.start).mag();
		this.start = this.pos.add(this.dir.mult(-length / 2));
		this.end = this.pos.add(this.dir.mult(length / 2));
	}
}

// ! Game ------------------------------------------------------------------------------------------------
class Keys {
	UP_R: boolean;
	DOWN_R: boolean;
	UP_L: boolean;
	DOWN_L: boolean;

	constructor() {
		this.UP_R = false;
		this.DOWN_R = false;
		this.UP_L = false;
		this.DOWN_L = false;
	}
}

class Pong {
	keys: Keys;
	ball: Ball;
	wait: boolean;
	sound: number;
	playerScore: number;
	playerNoBan: number;
	frameId: number = 0;
	opponentScore: number;
	intervalId: number = 0;
	paused: boolean = false;
	rightPaddle: Paddle;
	leftPaddle: Paddle;
	canvas: HTMLCanvasElement | null = null;
	ctx: CanvasRenderingContext2D | null = null;
	updateWinner: (w: 'Player 1' | 'Player 2' | 'None') => void = (w: 'Player 1' | 'Player 2' | 'None') => void w;

	constructor() {
		this.sound = 0;
		this.wait = false;
		this.playerNoBan = 1;
		this.playerScore = 0;
		this.opponentScore = 0;
		this.keys = new Keys();
		this.ball = new Ball({ direction: new Vector(0, 0) });
		this.leftPaddle = new Paddle({ center: new Vector(Main.PaddleDistance, Math.ceil(Main.PongHeight / 2)) });
		this.rightPaddle = new Paddle({ center: new Vector(Main.PongWidth - Main.PaddleDistance, Math.ceil(Main.PongHeight / 2)) });
	}
	setup(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, updateWinner: (w: 'Player 1' | 'Player 2' | 'None') => void): void {
		if (!canvas || !ctx) return;
		this.ctx = ctx;
		this.wait = false;
		this.canvas = canvas;
		this.playerScore = 0;
		this.opponentScore = 0;
		this.updateWinner = updateWinner;
		this.canvas.addEventListener('keyup', this.keyUp.bind(this));
		this.canvas.addEventListener('keydown', this.keyDown.bind(this));
		this.reset();
		this.draw();
		this.frameId = requestAnimationFrame(this.mainLoop.bind(this));
	}
	reset(): void {
		this.sound = 0;
		this.wait = false;
		this.playerNoBan = 1;
		this.ball = new Ball({ direction: new Vector(0, 0) });
		this.draw();
		let angle = randInt((-Math.PI / 4) * 1000, (Math.PI / 4) * 1000) / 1000;
		if (this.playerNoBan === 3 || this.playerNoBan === 4) angle += Math.PI;
		setTimeout(() => (this.ball = new Ball({ direction: new Vector(1 * Math.cos(angle), 1 * Math.sin(angle)).unit() })), 500);
		setTimeout(() => (this.wait = true), 1000);
	}
	pause(state: boolean) {
		this.paused = state;
	}
	clear() {
		cancelAnimationFrame(this.frameId);
		if (this.canvas) {
			this.canvas.removeEventListener('keyup', this.keyUp.bind(this));
			this.canvas.removeEventListener('keydown', this.keyDown.bind(this));
		}
	}

	keyDown(e: KeyboardEvent) {
		e.preventDefault();
		if (e.code === 'ArrowUp') this.keys.UP_R = true;
		if (e.code === 'ArrowDown') this.keys.DOWN_R = true;
		if (e.code === 'KeyW') this.keys.UP_L = true;
		if (e.code === 'KeyS') this.keys.DOWN_L = true;
		this.rightPaddle.move(this.keys.UP_R, this.keys.DOWN_R);
		this.leftPaddle.move(this.keys.UP_L, this.keys.DOWN_L);
	}
	keyUp(e: KeyboardEvent) {
		e.preventDefault();
		if (e.code === 'ArrowUp') this.keys.UP_R = false;
		if (e.code === 'ArrowDown') this.keys.DOWN_R = false;
		if (e.code === 'KeyW') this.keys.UP_L = false;
		if (e.code === 'KeyS') this.keys.DOWN_L = false;
		this.rightPaddle.move(this.keys.UP_L, this.keys.DOWN_L);
		this.leftPaddle.move(this.keys.UP_L, this.keys.DOWN_L);
	}

	collision_response(normal: Vector): void {
		this.ball.direction = this.ball.direction.subtr(normal.mult(2 * Vector.dot(this.ball.direction, normal)));
	}

	updateObjects(): void {
		if (!this.wait || this.paused) return;
		this.ball.reposition();
		this.rightPaddle.reposition();
		this.leftPaddle.reposition();
		// * TOP
		if (this.ball.pos.y < Main.BallRadius) {
			this.ball.pos.y = Main.BallRadius;
			this.collision_response(new Vector(0, 1));
			this.sound = 1;
		}
		// * BOTTOM
		if (this.ball.pos.y > Main.PongHeight - Main.BallRadius) {
			this.ball.pos.y = Main.PongHeight - Main.BallRadius;
			this.collision_response(new Vector(0, -1));
			this.sound = 1;
		}
		// // * RIGHT
		// if (this.ball.pos.x > Main.PongWidth - Main.BallRadius) {
		// 	this.ball.pos.x = Main.PongWidth - Main.BallRadius;
		// 	this.collision_response(new Vector(-1, 0));
		// 	this.sound = 1;
		// }
		// // * LEFT
		// if (this.ball.pos.x < Main.BallRadius) {
		// 	this.ball.pos.x = Main.BallRadius;
		// 	this.collision_response(new Vector(1, 0));
		// 	this.sound = 1;
		// }
		// * RIGHT
		if (this.ball.pos.x > Main.PongWidth - this.leftPaddle.start.x - Main.PaddleRadius - Main.BallRadius) {
			if (
				this.ball.pos.y + Main.BallRadius > this.rightPaddle.start.y &&
				this.ball.pos.y - Main.BallRadius < this.rightPaddle.end.y
			) {
				this.ball.pos.x = Main.PongWidth - this.leftPaddle.start.x - Main.PaddleRadius - Main.BallRadius;
				this.collision_response(new Vector(-1, 0));
				this.ball.direction.y += this.rightPaddle.acc.y * 0.1;
				this.ball.direction = this.ball.direction.unit();
				this.sound = 2;
			} else {
				this.playerScore += 1;
				this.playerNoBan += 1;
				this.sound = 3;
				this.reset();
			}
		}
		// * LEFT
		if (this.ball.pos.x < this.leftPaddle.start.x + Main.PaddleRadius + Main.BallRadius) {
			if (this.ball.pos.y + Main.BallRadius > this.leftPaddle.start.y && this.ball.pos.y - Main.BallRadius < this.leftPaddle.end.y) {
				this.ball.pos.x = this.leftPaddle.start.x + Main.PaddleRadius + Main.BallRadius;
				this.collision_response(new Vector(1, 0));
				this.ball.direction.y += this.leftPaddle.acc.y * 0.1;
				this.ball.direction = this.ball.direction.unit();
				this.sound = 2;
			} else {
				this.opponentScore += 1;
				this.playerNoBan += 1;
				this.sound = 3;
				this.reset();
			}
		}
	}
	drawRightPaddles() {
		if (this.ctx === null) return;
		this.ctx.beginPath();
		this.ctx.fillStyle = '#b3ec4b';
		this.ctx.rect(
			this.rightPaddle.pos.x - Main.PaddleRadius,
			this.rightPaddle.pos.y - Main.PaddleHeight,
			Main.PaddleRadius * 2,
			Main.PaddleHeight * 2
		);
		this.ctx.fill();
		this.ctx.beginPath();
	}
	drawLeftPaddles() {
		if (this.ctx === null) return;
		this.ctx.fillStyle = '#b3ec4b';
		this.ctx.rect(
			this.leftPaddle.pos.x - Main.PaddleRadius,
			this.leftPaddle.pos.y - Main.PaddleHeight,
			Main.PaddleRadius * 2,
			Main.PaddleHeight * 2
		);
		this.ctx.fill();
		this.ctx.beginPath();
	}
	drawBall() {
		if (this.ctx === null) return;
		this.ctx.beginPath();
		this.ctx.arc(this.ball.pos.x, this.ball.pos.y, Main.BallRadius, 0, 2 * Math.PI);
		this.ctx.strokeStyle = '#b3ec4b';
		this.ctx.stroke();
		this.ctx.fillStyle = '#b3ec4b';
		this.ctx.fill();
		this.ctx.closePath();
	}
	drawSep() {
		if (this.ctx === null) return;
		this.ctx.save();
		this.ctx.setLineDash([5, 5]);
		this.ctx.strokeStyle = '#b3ec4b';
		this.ctx.lineWidth = 2;
		this.ctx.beginPath();
		this.ctx.moveTo(Main.PongWidth / 2, 0);
		this.ctx.lineTo(Main.PongWidth / 2, Main.PongHeight);
		this.ctx.stroke();
		this.ctx.restore();
	}
	drawCircle() {
		if (this.ctx === null) return;
		this.ctx.save();
		this.ctx.setLineDash([5, 5]);
		this.ctx.strokeStyle = '#6cb42a';
		this.ctx.lineWidth = 2;
		this.ctx.beginPath();
		this.ctx.arc(Main.PongWidth / 2, Main.PongHeight / 2, 50, 0, Math.PI * 2);
		this.ctx.stroke();
		this.ctx.restore();
	}
	drawScore() {
		if (this.ctx === null) return;
		this.ctx.font = 'bold 64px monospace';
		this.ctx.fillStyle = '#ffffff'; // Your accent color
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillText(this.playerScore.toString(), Main.PongWidth / 2 - 100, 70);
		this.ctx.fillText(this.opponentScore.toString(), Main.PongWidth / 2 + 100, 70);
	}
	draw() {
		if (this.ctx === null || this.canvas === null) return;
		this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
		this.drawCircle();
		this.drawSep();
		this.drawBall();
		this.drawRightPaddles();
		this.drawLeftPaddles();
		this.drawScore();
	}
	mainLoop() {
		if (this.ctx === null || this.canvas === null) return;
		if (this.playerNoBan >= 5) this.playerNoBan = 1;
		if (this.playerScore >= Main.FinalScore) this.updateWinner('Player 1');
		else if (this.opponentScore >= Main.FinalScore) this.updateWinner('Player 2');
		this.updateObjects();
		this.draw();
		this.frameId = requestAnimationFrame(this.mainLoop.bind(this));
	}
}

export default Pong;
