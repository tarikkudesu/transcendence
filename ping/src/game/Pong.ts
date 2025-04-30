import Ball from './Ball';
import Paddle from './Paddle';
import Vector from './Vector';
import Wall from './Wall';

export const friction: number = 0.1;

export class Keys {
	UP_1: boolean = false;
	UP_2: boolean = false;
	DOWN_1: boolean = false;
	DOWN_2: boolean = false;
}

export class Pong {
	gaming: boolean = true;
	keys: Keys = new Keys();
	ballRadius: number = 10; // * Changable
	paddleHeight: number = 60; // * Changable
	paddleRadius: number = 10; // * Changable
	paddleDistance: number = 15; // * Changable
	canvas: HTMLCanvasElement | null = null;
	ctx: CanvasRenderingContext2D | null = null;
	TopWall: Wall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
	RightWall: Wall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
	BottomWall: Wall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
	LeftWall: Wall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
	ball: Ball = new Ball({ pos: new Vector(0, 0), radius: 0, velocity: new Vector(0, 0) });
	rightPaddle: Paddle = new Paddle({ start: new Vector(0, 0), end: new Vector(0, 0), radius: 0, constrains: new Vector(0, 0) });
	leftpaddle: Paddle = new Paddle({ start: new Vector(0, 0), end: new Vector(0, 0), radius: 0, constrains: new Vector(0, 0) });

	constructor() {
		this.mainLoop = this.mainLoop.bind(this);
		this.keyDown = this.keyDown.bind(this);
		this.keyUp = this.keyUp.bind(this);
	}

	setup(canvas: HTMLCanvasElement | null, ctx: CanvasRenderingContext2D | null) {
		if (!canvas || !ctx) return;
		this.ctx = ctx;
		this.canvas = canvas;
		const width = this.canvas.clientWidth;
		const height = this.canvas.clientHeight;

		// ! Create Walls
		this.TopWall = new Wall({ start: new Vector(5, 0), end: new Vector(width - 5, 0) });
		this.RightWall = new Wall({ start: new Vector(width - 5, 0), end: new Vector(width - 5, height) });
		this.BottomWall = new Wall({ start: new Vector(width - 5, height), end: new Vector(0, height) });
		this.LeftWall = new Wall({ start: new Vector(5, height), end: new Vector(5, 0) });

		// ! Create Paddles
		this.rightPaddle = new Paddle({
			start: new Vector(width - this.paddleDistance, height / 2 - this.paddleHeight),
			end: new Vector(width - this.paddleDistance, height / 2 + this.paddleHeight),
			radius: this.paddleRadius,
			constrains: new Vector(
				this.paddleHeight + this.paddleRadius + this.ballRadius,
				height - this.paddleHeight - this.paddleRadius - this.ballRadius
			),
		});
		this.leftpaddle = new Paddle({
			start: new Vector(this.paddleDistance, height / 2 - this.paddleHeight),
			end: new Vector(this.paddleDistance, height / 2 + this.paddleHeight),
			radius: this.paddleRadius,
			constrains: new Vector(
				this.paddleHeight + this.paddleRadius + this.ballRadius,
				height - this.paddleHeight - this.paddleRadius - this.ballRadius
			),
		});

		const angle = randInt((-Math.PI / 6) * 100, (Math.PI / 6) * 100);
		// ! Create ball
		this.ball = new Ball({
			pos: new Vector(width / 2, height / 2),
			radius: this.ballRadius,
			velocity: new Vector(1 * Math.cos(angle / 100), 1 * Math.sin(angle / 100)).mult(0.7),
		});

		// ! Add Event Listeners
		this.canvas.addEventListener('keydown', this.keyDown);
		this.canvas.addEventListener('keyup', this.keyUp);
		requestAnimationFrame(this.mainLoop);
	}
	keyDown(e: KeyboardEvent) {
		if (e.code === 'ArrowUp') this.keys.UP_1 = true;
		if (e.code === 'ArrowDown') this.keys.DOWN_1 = true;
		if (e.code === 'KeyW') this.keys.UP_2 = true;
		if (e.code === 'KeyS') this.keys.DOWN_2 = true;
	}
	keyUp(e: KeyboardEvent) {
		if (e.code === 'ArrowUp') this.keys.UP_1 = false;
		if (e.code === 'ArrowDown') this.keys.DOWN_1 = false;
		if (e.code === 'KeyW') this.keys.UP_2 = false;
		if (e.code === 'KeyS') this.keys.DOWN_2 = false;
	}

	drawBall(): void {
		if (this.ctx === null || this.canvas === null) return;
		this.ball.draw(this.ctx);
		if (this.collision_ball_paddle(this.ball, this.rightPaddle)) {
			this.penetration_resolution_ball_paddle(this.ball, this.rightPaddle);
			this.collision_response_ball_paddle(this.ball, this.rightPaddle);
		}
		if (this.collision_ball_paddle(this.ball, this.leftpaddle)) {
			this.penetration_resolution_ball_paddle(this.ball, this.leftpaddle);
			this.collision_response_ball_paddle(this.ball, this.leftpaddle);
		}
		if (this.collision_detection_ball_wall(this.ball, this.TopWall)) {
			this.penetration_resolution_ball_wall(this.ball, this.TopWall);
			this.collision_response_ball_wall(this.ball, this.TopWall);
		}
		if (this.collision_detection_ball_wall(this.ball, this.RightWall)) {
			location.reload();
			this.gaming = false;
			// this.penetration_resolution_ball_wall(this.ball, this.RightWall);
			// this.collision_response_ball_wall(this.ball, this.RightWall);
		}
		if (this.collision_detection_ball_wall(this.ball, this.BottomWall)) {
			this.penetration_resolution_ball_wall(this.ball, this.BottomWall);
			this.collision_response_ball_wall(this.ball, this.BottomWall);
		}
		if (this.collision_detection_ball_wall(this.ball, this.LeftWall)) {
			location.reload();
			this.gaming = false;
			// this.penetration_resolution_ball_wall(this.ball, this.LeftWall);
			// this.collision_response_ball_wall(this.ball, this.LeftWall);
		}
		this.ball.reposition();
	}
	drawWall() {
		if (this.ctx === null || this.canvas === null) return;
		this.TopWall.draw(this.ctx);
		this.BottomWall.draw(this.ctx);
		this.ball.draw(this.ctx);
	}
	drawPaddles() {
		if (this.ctx === null || this.canvas === null) return;
		this.rightPaddle.move(this.keys.UP_1, this.keys.DOWN_1);
		this.leftpaddle.move(this.keys.UP_2, this.keys.DOWN_2);
		this.rightPaddle.draw(this.ctx);
		this.leftpaddle.draw(this.ctx);
		this.rightPaddle.reposition();
		this.leftpaddle.reposition();
	}

	// * Collisions
	closestPointOnLineSigment(point: Vector, wall: Wall): Vector {
		// * check if the ball is before the line segment
		const ballToWallStart = wall.start.subtr(point);
		if (Vector.dot(wall.dir, ballToWallStart) > 0) return wall.start;
		// * check if the ball is after the line segment
		const wallEndToBall = point.subtr(wall.end);
		if (Vector.dot(wall.dir, wallEndToBall) > 0) return wall.end;
		// * check if the ball is inside the line segment
		const closestDist = Vector.dot(wall.dir, ballToWallStart);
		const closestVect = wall.dir.mult(closestDist);
		return wall.start.subtr(closestVect);
	}

	// ! Collision Ball Wall
	collision_detection_ball_wall(ball: Ball, wall: Wall): boolean {
		const ballToClosest = this.closestPointOnLineSigment(ball.pos, wall).subtr(ball.pos);
		const penVect: Vector = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall));
		if (Vector.dot(penVect, wall.dir.normal()) < 0) return true;
		if (ballToClosest.mag() <= ball.radius) return true;
		return false;
	}
	penetration_resolution_ball_wall(ball: Ball, wall: Wall) {
		let penVect: Vector = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall));
		if (Vector.dot(penVect, wall.dir.normal()) < 0) {
			penVect = penVect.normal().normal();
		}
		ball.pos = ball.pos.add(penVect.unit().mult(ball.radius - penVect.mag()));
	}
	collision_response_ball_wall(ball: Ball, wall: Wall) {
		const normal: Vector = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall)).unit();
		ball.velocity = ball.velocity.subtr(normal.mult(2 * Vector.dot(ball.velocity, normal)));
	}

	// ! Collision Ball Paddle
	collision_ball_paddle(ball: Ball, paddle: Paddle): boolean {
		const wall: Wall = new Wall({ start: paddle.start, end: paddle.end });
		const ballToClosest: Vector = this.closestPointOnLineSigment(ball.pos, wall);
		const distance: number = ballToClosest.subtr(ball.pos).mag();
		if (distance < paddle.radius + ball.radius) return true;
		return false;
	}
	penetration_resolution_ball_paddle(ball: Ball, paddle: Paddle): void {
		const wall: Wall = new Wall({ start: paddle.start, end: paddle.end });
		const penVect: Vector = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall));
		ball.pos = ball.pos.add(penVect.unit().mult(ball.radius + paddle.radius - penVect.mag()));
	}
	collision_response_ball_paddle(ball: Ball, paddle: Paddle): void {
		const wall: Wall = new Wall({ start: paddle.start, end: paddle.end });
		const normal: Vector = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall)).unit();
		ball.velocity = ball.velocity.subtr(normal.mult(2 * Vector.dot(ball.velocity, normal))).add(paddle.acc.mult(0.2));
		if (ball.velocity.mag() > 3) ball.velocity = ball.velocity.unit().mult(3);
		if (Math.abs(ball.velocity.y) > Math.abs(ball.velocity.x)) {
			const x: number = ball.velocity.x;
			ball.velocity.x = ball.velocity.y;
			ball.velocity.y = x;
		}
	}

	drawSeperator() {
		if (this.ctx === null || this.canvas === null) return;
		this.ctx.beginPath();
		this.ctx.arc(this.canvas.clientWidth / 2, 10, 5, Math.PI, 2 * Math.PI);
		this.ctx.arc(this.canvas.clientWidth / 2, this.canvas.clientHeight - 10, 5, 2 * Math.PI, Math.PI);
		this.ctx.closePath();
		this.ctx.moveTo(this.canvas.clientWidth / 2, 10);
		this.ctx.lineTo(this.canvas.clientWidth / 2, this.canvas.clientHeight - 10);
		this.ctx.strokeStyle = 'black';
		this.ctx.stroke();
		this.ctx.fillStyle = 'black';
		this.ctx.fill();
	}
	// ! Main Loooooooooop
	mainLoop() {
		if (this.ctx === null || this.canvas === null) return;
		this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
		this.drawWall();
		this.drawBall();
		this.drawPaddles();
		this.drawSeperator();
		requestAnimationFrame(this.mainLoop);
	}
}

export function randInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
