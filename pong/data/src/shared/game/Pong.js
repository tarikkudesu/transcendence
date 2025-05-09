import { Paddle } from './Paddle.js';
import { Ball } from './Ball.js';
import { Vector } from './Vector.js';
import { Wall } from './Wall.js';

const friction = 0.05;

export function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Keys {
	UP_R = false;
	DOWN_R = false;
	UP_L = false;
	DOWN_L = false;
}

export class Pong {
	gaming = true;
	keys = new Keys();
	ballRadius = 10; // * Customizable
	paddleHeight = 60; // * Customizable
	paddleRadius = 10; // * Customizable
	paddleDistance = 15; // * Customizable
	TopWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
	RightWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
	BottomWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
	LeftWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
	ball = new Ball({ pos: new Vector(0, 0), radius: 0, velocity: new Vector(0, 0) });
	rightPaddle = new Paddle({ start: new Vector(0, 0), end: new Vector(0, 0), radius: 0, constrains: new Vector(0, 0) });
	leftpaddle = new Paddle({ start: new Vector(0, 0), end: new Vector(0, 0), radius: 0, constrains: new Vector(0, 0) });

	constructor() {}

	setup(width, height) {
		// * Create Walls
		this.TopWall = new Wall({ start: new Vector(5, 0), end: new Vector(width - 5, 0) });
		this.RightWall = new Wall({ start: new Vector(width - 5, 0), end: new Vector(width - 5, height) });
		this.BottomWall = new Wall({ start: new Vector(width - 5, height), end: new Vector(0, height) });
		this.LeftWall = new Wall({ start: new Vector(5, height), end: new Vector(5, 0) });

		// * Create Paddles
		this.rightPaddle = new Paddle({
			start: new Vector(width - this.paddleDistance, height / 2 - this.paddleHeight),
			end: new Vector(width - this.paddleDistance, height / 2 + this.paddleHeight),
			radius: this.paddleRadius,
			constrains: new Vector(
				this.paddleHeight + this.paddleRadius + this.ballRadius * 2,
				height - this.paddleHeight - this.paddleRadius - this.ballRadius
			),
		});
		this.leftpaddle = new Paddle({
			start: new Vector(this.paddleDistance, height / 2 - this.paddleHeight),
			end: new Vector(this.paddleDistance, height / 2 + this.paddleHeight),
			radius: this.paddleRadius,
			constrains: new Vector(
				this.paddleHeight + this.paddleRadius + this.ballRadius * 2,
				height - this.paddleHeight - this.paddleRadius - this.ballRadius
			),
		});

		const angle = randInt((-Math.PI / 6) * 100, (Math.PI / 6) * 100);

		// * Create ball
		this.ball = new Ball({
			pos: new Vector(width / 2, height / 2),
			radius: this.ballRadius,
			velocity: new Vector(1 * Math.cos(angle / 100), 1 * Math.sin(angle / 100)).unit(),
		});
	}
	keyPressRight(up, down) {
		if (up) this.keys.UP_R = true;
		else this.keys.UP_R = false;
		if (down) this.keys.DOWN_R = true;
		else this.keys.DOWN_R = false;

		this.rightPaddle.move(up, down);
	}
	keyPressLeft(up, down) {
		if (up) this.keys.UP_R = true;
		else this.keys.UP_R = false;
		if (down) this.keys.DOWN_R = true;
		else this.keys.DOWN_R = false;

		this.leftpaddle.move(up, down);
	}

	upddateBall() {
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
		if (this.collision_detection_ball_wall(this.ball, this.BottomWall)) {
			this.penetration_resolution_ball_wall(this.ball, this.BottomWall);
			this.collision_response_ball_wall(this.ball, this.BottomWall);
		}
		if (this.collision_detection_ball_wall(this.ball, this.RightWall)) {
			this.gaming = false;
			// this.penetration_resolution_ball_wall(this.ball, this.RightWall);
			// this.collision_response_ball_wall(this.ball, this.RightWall);
		}
		if (this.collision_detection_ball_wall(this.ball, this.LeftWall)) {
			this.gaming = false;
			// this.penetration_resolution_ball_wall(this.ball, this.LeftWall);
			// this.collision_response_ball_wall(this.ball, this.LeftWall);
		}
		this.ball.reposition();
	}
	updatePaddles() {
		// TODO: needs morework
		// TODO: collision detection
		// TODO: penetration resolution
		// TODO: collision response
		this.rightPaddle.reposition();
		this.leftpaddle.reposition();
	}

	// * Collisions
	closestPointOnLineSigment(point, wall) {
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

	// * Collision Ball Wall
	collision_detection_ball_wall(ball, wall) {
		const ballToClosest = this.closestPointOnLineSigment(ball.pos, wall).subtr(ball.pos);
		const penVect = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall));
		if (Vector.dot(penVect, wall.dir.normal()) < 0) return true;
		if (ballToClosest.mag() <= ball.radius) return true;
		return false;
	}
	penetration_resolution_ball_wall(ball, wall) {
		let penVect = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall));
		if (Vector.dot(penVect, wall.dir.normal()) < 0) penVect = penVect.normal().normal();
		ball.pos = ball.pos.add(penVect.unit().mult(ball.radius - penVect.mag()));
	}
	collision_response_ball_wall(ball, wall) {
		const normal = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall)).unit();
		ball.velocity = ball.velocity.subtr(normal.mult(2 * Vector.dot(ball.velocity, normal)));
	}

	// * Collision Ball Paddle
	collision_ball_paddle(ball, paddle) {
		const wall = new Wall({ start: paddle.start, end: paddle.end });
		const ballToClosest = this.closestPointOnLineSigment(ball.pos, wall);
		const distance = ballToClosest.subtr(ball.pos).mag();
		if (distance < paddle.radius + ball.radius) return true;
		return false;
	}
	penetration_resolution_ball_paddle(ball, paddle) {
		const wall = new Wall({ start: paddle.start, end: paddle.end });
		const penVect = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall));
		ball.pos = ball.pos.add(penVect.unit().mult(ball.radius + paddle.radius - penVect.mag()));
	}
	collision_response_ball_paddle(ball, paddle) {
		const wall = new Wall({ start: paddle.start, end: paddle.end });
		const normal = ball.pos.subtr(this.closestPointOnLineSigment(ball.pos, wall)).unit();
		ball.velocity = ball.velocity.subtr(normal.mult(Vector.dot(ball.velocity, normal)).mult(2)).mult(1 + paddle.acc.unit().mag() * 0.2);
		if (ball.velocity.mag() > 2) ball.velocity = ball.velocity.unit().mult(2);
		if (Math.abs(ball.velocity.y) > Math.abs(ball.velocity.x)) {
			const x = ball.velocity.x;
			ball.velocity.x = ball.velocity.y;
			ball.velocity.y = x;
		}
	}

	// * Main Frame
	updateFrame(frames) {
		this.upddateBall();
		this.updatePaddles();
	}
}

// // ! Ball ------------------------------------------------------------------------------

// class Ball
// {
// 	pos;
// 	radius;
// 	velocity = new Vector(0, 0);
// 	constructor({ pos, radius, velocity })
// 	{
// 		this.pos = pos;
// 		this.radius = radius;
// 		this.velocity = velocity;
// 	}
// 	reposition()
// 	{
// 		this.pos = this.pos.add(this.velocity.mult(10));
// 	}
// }

// // ! Wall ------------------------------------------------------------------------------
// class Wall
// {
// 	dir;
// 	end;
// 	start;
// 	center;
// 	length;
// 	constructor({ start, end })
// 	{
// 		this.start = start;
// 		this.end = end;
// 		this.dir = this.end.subtr(this.start).unit();
// 		this.center = this.start.add(this.end).mult(0.5);
// 		this.length = this.end.subtr(this.start).mag(); // ! Length Might not be needed
// 	}
// }

// // ! Paddle ----------------------------------------------------------------------------
// export class Paddle
// {
// 	start;
// 	end;
// 	radius;
// 	length;
// 	dir;
// 	pos;
// 	vel = new Vector(0, 0);
// 	acc = new Vector(0, 0);
// 	constrains = new Vector(0, 0);
// 	acceleration = 1.8;
// 	constructor({ constrains, radius, start, end })
// 	{
// 		this.constrains = constrains;
// 		this.radius = radius;
// 		this.start = start;
// 		this.end = end;
// 		this.pos = this.start.add(this.end).mult(0.5);
// 		this.dir = this.end.subtr(this.start).unit();
// 		this.length = this.end.subtr(this.start).mag();
// 	}
// 	move(Up, Down)
// 	{
// 		if (Up) this.acc = this.dir.mult(-this.acceleration);
// 		if (Down) this.acc = this.dir.mult(this.acceleration);
// 		if (!Up && !Down) this.acc = new Vector(0, 0);
// 	}
// 	reposition()
// 	{
// 		this.acc = this.acc.unit().mult(this.acceleration);
// 		this.vel = this.vel.add(this.acc).mult(1 - friction);
// 		const newPos = this.pos.add(this.vel);
// 		if (newPos.y < this.constrains.x) newPos.y = this.constrains.x;
// 		if (newPos.y > this.constrains.y) newPos.y = this.constrains.y;
// 		this.pos = newPos;
// 		this.start = this.pos.add(this.dir.mult(-this.length / 2));
// 		this.end = this.pos.add(this.dir.mult(this.length / 2));
// 	}
// }

// // ! Vector -----------------------------------------------------------------------

// export class Vector
// {
// 	x;
// 	y;
// 	constructor(x, y)
// 	{
// 		this.x = x;
// 		this.y = y;
// 	}
// 	add(v)
// 	{
// 		return new Vector(this.x + v.x, this.y + v.y);
// 	}
// 	subtr(v)
// 	{
// 		return new Vector(this.x - v.x, this.y - v.y);
// 	}
// 	mag()
// 	{
// 		return Math.sqrt(this.x ** 2 + this.y ** 2);
// 	}
// 	mult(n)
// 	{
// 		return new Vector(this.x * n, this.y * n);
// 	}
// 	normal()
// 	{
// 		return new Vector(-this.y, this.x).unit();
// 	}
// 	unit()
// 	{
// 		if (this.mag() === 0) return new Vector(0, 0);
// 		else return new Vector(this.x / this.mag(), this.y / this.mag());
// 	}
// 	static dot(v1, v2)
// 	{
// 		return v1.x * v2.x + v1.y * v2.y;
// 	}

// 	static cross(v1, v2)
// 	{
// 		return v1.x * v2.y - v1.y * v2.x;
// 	}
// }
