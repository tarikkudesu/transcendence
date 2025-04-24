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
	keys: Keys = new Keys();
	paddleHeight: number = 60; // * Changable
	paddleRadius: number = 15; // * Changable
	paddleDistance: number = 30; // * Changable
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
		const height = this.canvas.clientHeight;
		const width = this.canvas.clientWidth;

		// ! Create Walls
		this.TopWall = new Wall({ start: new Vector(0, 0), end: new Vector(width, 0) });
		this.RightWall = new Wall({ start: new Vector(width, 0), end: new Vector(width, height) });
		this.BottomWall = new Wall({ start: new Vector(width, height), end: new Vector(0, height) });
		this.LeftWall = new Wall({ start: new Vector(0, height), end: new Vector(0, 0) });

		// ! Create Paddles
		this.rightPaddle = new Paddle({
			start: new Vector(width - this.paddleDistance, height / 2 - this.paddleHeight),
			end: new Vector(width - this.paddleDistance, height / 2 + this.paddleHeight),
			radius: this.paddleRadius,
			constrains: new Vector(0, height),
		});
		this.leftpaddle = new Paddle({
			start: new Vector(this.paddleDistance, height / 2 - this.paddleHeight),
			end: new Vector(this.paddleDistance, height / 2 + this.paddleHeight),
			radius: this.paddleRadius,
			constrains: new Vector(0, height),
		});

		// ! Create ball
		this.ball = new Ball({
			pos: new Vector(width / 2, height / 2),
			radius: 20,
			velocity: new Vector(randInt(-10, 10), randInt(-10, 10)).unit(),
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
		if (this.collision_detection_ball_wall(this.ball, this.TopWall)) {
			this.penetration_resolution_ball_wall(this.ball, this.TopWall);
			this.collision_response_ball_wall(this.ball, this.TopWall);
		}
		if (this.collision_detection_ball_wall(this.ball, this.RightWall)) {
			this.penetration_resolution_ball_wall(this.ball, this.RightWall);
			this.collision_response_ball_wall(this.ball, this.RightWall);
		}
		if (this.collision_detection_ball_wall(this.ball, this.BottomWall)) {
			this.penetration_resolution_ball_wall(this.ball, this.BottomWall);
			this.collision_response_ball_wall(this.ball, this.BottomWall);
		}
		if (this.collision_detection_ball_wall(this.ball, this.LeftWall)) {
			this.penetration_resolution_ball_wall(this.ball, this.LeftWall);
			this.collision_response_ball_wall(this.ball, this.LeftWall);
		}
		if (this.collision_ball_paddle(this.ball, this.rightPaddle)) {
			this.penetration_resolution_ball_paddle(this.ball, this.rightPaddle);
			this.collision_resolution_ball_paddle(this.ball, this.rightPaddle);
		}
		if (this.collision_ball_paddle(this.ball, this.leftpaddle)) {
			this.penetration_resolution_ball_paddle(this.ball, this.leftpaddle);
			this.collision_resolution_ball_paddle(this.ball, this.leftpaddle);
		}
		this.ball.reposition();
	}
	drawWall() {
		if (this.ctx === null || this.canvas === null) return;
		this.TopWall.draw(this.ctx);
		this.RightWall.draw(this.ctx);
		this.BottomWall.draw(this.ctx);
		this.LeftWall.draw(this.ctx);
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
		if (ballToClosest.mag() <= ball.radius) return true;
		return false;
	}
	penetration_resolution_ball_wall(ball: Ball, wall: Wall) {
		const penVect: Vector = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall));
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
	collision_resolution_ball_paddle(ball: Ball, paddle: Paddle): void {
		const wall: Wall = new Wall({ start: paddle.start, end: paddle.end });
		const normal: Vector = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall)).unit();
		ball.velocity = ball.velocity.subtr(normal.mult(2 * Vector.dot(ball.velocity, normal)));
	}
	// ! Collision Ball Ball
	collision_detection_ball_ball(ball1: Ball, ball2: Ball): boolean {
		if (ball1.radius + ball2.radius >= ball2.pos.subtr(ball1.pos).mag()) return true;
		return false;
	}
	penetration_resolution_ball_ball(ball1: Ball, ball2: Ball): void {
		const dist: Vector = ball1.pos.subtr(ball2.pos);
		const pen_depth: number = ball1.radius + ball2.radius - dist.mag();
		const pen_res = dist.unit().mult(pen_depth);
		ball1.pos = ball1.pos.add(pen_res);
		ball2.pos = ball2.pos.add(pen_res);
	}
	collision_ball_ball(ball1: Ball, ball2: Ball): void {
		const normal: Vector = ball1.pos.subtr(ball2.pos).unit();
		ball1.velocity = ball1.velocity.subtr(normal.mult(2 * Vector.dot(ball1.velocity, normal)));
		ball2.velocity = ball2.velocity.subtr(normal.mult(2 * Vector.dot(ball2.velocity, normal.mult(-1))));
	}

	// ! Main Loooooooooop
	mainLoop(frames: number) {
		if (this.ctx === null || this.canvas === null) return;
		this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
		this.drawWall();
		this.drawBall();
		this.drawPaddles();
		requestAnimationFrame(this.mainLoop);
	}
}

export function randInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
