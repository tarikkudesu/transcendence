import * as Main from '../index.js';
// ! Vector ------------------------------------------------------------------------------------------------
export class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	add(v) {
		return new Vector(this.x + v.x, this.y + v.y);
	}
	subtr(v) {
		return new Vector(this.x - v.x, this.y - v.y);
	}
	mag() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}
	mult(n) {
		return new Vector(this.x * n, this.y * n);
	}
	normal() {
		return new Vector(-this.y, this.x).unit();
	}
	unit() {
		if (this.mag() === 0) return new Vector(0, 0);
		else return new Vector(this.x / this.mag(), this.y / this.mag());
	}
	static dot(v1, v2) {
		return v1.x * v2.x + v1.y * v2.y;
	}
	static cross(v1, v2) {
		return v1.x * v2.y - v1.y * v2.x;
	}
}
export class Ball {
	constructor({ pos, radius, velocity }) {
		this.velocity = new Vector(0, 0);
		this.pos = pos;
		this.radius = radius;
		this.velocity = velocity;
	}
	reposition() {
		this.pos = this.pos.add(this.velocity.mult(10));
	}
}
export class Wall {
	constructor({ start, end }) {
		this.start = start;
		this.end = end;
		this.dir = this.end.subtr(this.start).unit();
		this.center = this.start.add(this.end).mult(0.5);
		this.length = this.end.subtr(this.start).mag();
	}
}
export class Paddle {
	constructor({ constrains, radius, start, end }) {
		this.vel = new Vector(0, 0);
		this.acc = new Vector(0, 0);
		this.constrains = new Vector(0, 0);
		this.acceleration = 1.8;
		this.constrains = constrains;
		this.radius = radius;
		this.start = start;
		this.end = end;
		this.pos = this.start.add(this.end).mult(0.5);
		this.dir = this.end.subtr(this.start).unit();
		this.length = this.end.subtr(this.start).mag();
	}
	move(Up, Down) {
		if (Up) this.acc = this.dir.mult(-this.acceleration);
		if (Down) this.acc = this.dir.mult(this.acceleration);
		if (!Up && !Down) this.acc = new Vector(0, 0);
	}
	reposition() {
		this.acc = this.acc.unit().mult(this.acceleration);
		this.vel = this.vel.add(this.acc).mult(1 - Main.friction);
		const newPos = this.pos.add(this.vel);
		if (newPos.y < this.constrains.x) newPos.y = this.constrains.x;
		if (newPos.y > this.constrains.y) newPos.y = this.constrains.y;
		this.pos = newPos;
		this.start = this.pos.add(this.dir.mult(-this.length / 2));
		this.end = this.pos.add(this.dir.mult(this.length / 2));
	}
}
// ! Game ------------------------------------------------------------------------------------------------
export var BallState;
(function (BallState) {
	BallState[(BallState['IN'] = 1)] = 'IN';
	BallState[(BallState['OUT_LEFT'] = 3)] = 'OUT_LEFT';
	BallState[(BallState['OUT_RIGHT'] = 2)] = 'OUT_RIGHT';
})(BallState || (BallState = {}));
class Keys {
	constructor() {
		this.UP_R = false;
		this.DOWN_R = false;
		this.UP_L = false;
		this.DOWN_L = false;
	}
}
export class Pong {
	constructor(player, opponent) {
		this.winner = '';
		this.playerScore = 0;
		this.opponentScore = 0;
		this.playerNoBan = 1;
		// * game data
		this.wait = false;
		this.sound = false;
		this.keys = new Keys();
		this.ballRadius = 10; // * Customizable
		this.paddleHeight = 60; // * Customizable
		this.paddleRadius = 10; // * Customizable
		this.paddleDistance = 15; // * Customizable
		this.TopWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
		this.RightWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
		this.BottomWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
		this.LeftWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
		this.ball = new Ball({ pos: new Vector(0, 0), radius: 0, velocity: new Vector(0, 0) });
		this.rightPaddle = new Paddle({ start: new Vector(0, 0), end: new Vector(0, 0), radius: 0, constrains: new Vector(0, 0) });
		this.leftPaddle = new Paddle({ start: new Vector(0, 0), end: new Vector(0, 0), radius: 0, constrains: new Vector(0, 0) });
		this.player = player;
		this.opponent = opponent;
		// * Create Walls
		this.TopWall = new Wall({ start: new Vector(0, 0), end: new Vector(Main.PongWidth, 0) });
		this.RightWall = new Wall({ start: new Vector(Main.PongWidth, 0), end: new Vector(Main.PongWidth, Main.PongHeight) });
		this.BottomWall = new Wall({ start: new Vector(Main.PongWidth, Main.PongHeight), end: new Vector(0, Main.PongHeight) });
		this.LeftWall = new Wall({ start: new Vector(0, Main.PongHeight), end: new Vector(0, 0) });
		// * Create Paddles
		this.rightPaddle = new Paddle({
			start: new Vector(Main.PongWidth - this.paddleDistance, Main.PongHeight / 2 - this.paddleHeight),
			end: new Vector(Main.PongWidth - this.paddleDistance, Main.PongHeight / 2 + this.paddleHeight),
			radius: this.paddleRadius,
			constrains: new Vector(
				this.paddleHeight + this.paddleRadius + this.ballRadius,
				Main.PongHeight - this.paddleHeight - this.paddleRadius - this.ballRadius
			),
		});
		this.leftPaddle = new Paddle({
			start: new Vector(this.paddleDistance, Main.PongHeight / 2 - this.paddleHeight),
			end: new Vector(this.paddleDistance, Main.PongHeight / 2 + this.paddleHeight),
			radius: this.paddleRadius,
			constrains: new Vector(
				this.paddleHeight + this.paddleRadius + this.ballRadius,
				Main.PongHeight - this.paddleHeight - this.paddleRadius - this.ballRadius
			),
		});
		this.setup();
		setTimeout(() => (this.wait = true), 1000);
	}
	setup() {
		let angle = Main.randInt((-Math.PI / 4) * 1000, (Math.PI / 4) * 1000) / 1000;
		if (this.playerNoBan === 3 || this.playerNoBan === 4) angle += Math.PI;
		// * Create ball
		this.ball = new Ball({
			pos: new Vector(Main.PongWidth / 2, Main.PongHeight / 2),
			radius: this.ballRadius,
			velocity: new Vector(1 * Math.cos(angle), 1 * Math.sin(angle)).unit(),
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
		this.leftPaddle.move(up, down);
	}
	upddateBall() {
		if (this.collision_ball_paddle(this.ball, this.rightPaddle)) {
			this.penetration_resolution_ball_paddle(this.ball, this.rightPaddle);
			this.collision_response_ball_paddle(this.ball, this.rightPaddle);
		}
		if (this.collision_ball_paddle(this.ball, this.leftPaddle)) {
			this.penetration_resolution_ball_paddle(this.ball, this.leftPaddle);
			this.collision_response_ball_paddle(this.ball, this.leftPaddle);
		}
		if (this.collision_detection_ball_wall(this.ball, this.TopWall)) {
			this.penetration_resolution_ball_wall(this.ball, this.TopWall);
			this.collision_response_ball_wall(this.ball, this.TopWall);
		}
		if (this.collision_detection_ball_wall(this.ball, this.BottomWall)) {
			this.penetration_resolution_ball_wall(this.ball, this.BottomWall);
			this.collision_response_ball_wall(this.ball, this.BottomWall);
		}
		if (this.wait) this.ball.reposition();
		if (this.collision_detection_ball_wall(this.ball, this.RightWall)) return BallState.OUT_RIGHT;
		if (this.collision_detection_ball_wall(this.ball, this.LeftWall)) return BallState.OUT_LEFT;
		return BallState.IN;
	}
	updatePaddles() {
		if (this.collision_ball_paddle(this.ball, this.rightPaddle)) {
			this.penetration_resolution_ball_paddle(this.ball, this.rightPaddle);
			this.collision_response_ball_paddle(this.ball, this.rightPaddle);
		}
		if (this.collision_ball_paddle(this.ball, this.leftPaddle)) {
			this.penetration_resolution_ball_paddle(this.ball, this.leftPaddle);
			this.collision_response_ball_paddle(this.ball, this.leftPaddle);
		}
		this.rightPaddle.reposition();
		this.leftPaddle.reposition();
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
		this.sound = true;
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
		this.sound = true;
	}
	// * Main Frame
	update() {
		if (this.winner !== '') return true;
		if (this.sound === true) this.sound = false;
		this.updatePaddles();
		const ballState = this.upddateBall();
		if (ballState === BallState.OUT_RIGHT) {
			this.playerScore += 1;
			this.playerNoBan += 1;
			this.wait = false;
			this.setup();
			setTimeout(() => (this.wait = true), 1000);
		} else if (ballState === BallState.OUT_LEFT) {
			this.opponentScore += 1;
			this.playerNoBan += 1;
			this.wait = false;
			this.setup();
			setTimeout(() => (this.wait = true), 1000);
		}
		if (this.playerScore >= 7) this.winner = this.player;
		else if (this.opponentScore >= 7) this.winner = this.opponent;
		if (this.playerNoBan >= 5) this.playerNoBan = 1;
		return false;
	}
}
// ! END
