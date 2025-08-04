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
	constructor({ direction }) {
		this.direction = new Vector(0, 0);
		this.pos = new Vector(Main.PongWidth / 2, Main.PongHeight / 2);
		this.direction = direction;
	}
	reposition() {
		this.pos = this.pos.add(this.direction.mult(Main.BallVelocity));
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
	constructor({ center }) {
		this.vel = new Vector(0, 0);
		this.acc = new Vector(0, 0);
		this.acceleration = 1.8;
		this.start = new Vector(center.x, center.y - Math.ceil(Main.PaddleHeight));
		this.end = new Vector(center.x, center.y + Math.ceil(Main.PaddleHeight));
		this.pos = center;
		this.dir = this.end.subtr(this.start).unit();
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
		if (newPos.y < 0) newPos.y = 0;
		if (newPos.y > Main.PongHeight) newPos.y = Main.PongHeight;
		this.pos = newPos;
		const length = this.end.subtr(this.start).mag();
		this.start = this.pos.add(this.dir.mult(-length / 2));
		this.end = this.pos.add(this.dir.mult(length / 2));
	}
}
// ! Game ------------------------------------------------------------------------------------------------
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
		this.TopWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
		this.RightWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
		this.BottomWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
		this.LeftWall = new Wall({ start: new Vector(0, 0), end: new Vector(0, 0) });
		this.ball = new Ball({ direction: new Vector(0, 0) });
		this.rightPaddle = new Paddle({ center: new Vector(0, 0) });
		this.leftPaddle = new Paddle({ center: new Vector(0, 0) });
		this.player = player;
		this.opponent = opponent;
		// * Create Walls
		this.TopWall = new Wall({ start: new Vector(0, 0), end: new Vector(Main.PongWidth, 0) });
		this.RightWall = new Wall({ start: new Vector(Main.PongWidth, 0), end: new Vector(Main.PongWidth, Main.PongHeight) });
		this.BottomWall = new Wall({ start: new Vector(Main.PongWidth, Main.PongHeight), end: new Vector(0, Main.PongHeight) });
		this.LeftWall = new Wall({ start: new Vector(0, Main.PongHeight), end: new Vector(0, 0) });
		// * Create Paddles
		this.rightPaddle = new Paddle({ center: new Vector(Main.PongWidth - Main.PaddleDistance, Math.ceil(Main.PongHeight / 2)) });
		this.leftPaddle = new Paddle({ center: new Vector(Main.PaddleDistance, Math.ceil(Main.PongHeight / 2)) });
		this.setup();
	}
	setup() {
		let angle = Main.randInt((-Math.PI / 4) * 1000, (Math.PI / 4) * 1000) / 1000;
		if (this.playerNoBan === 3 || this.playerNoBan === 4) angle += Math.PI;
		this.ball = new Ball({ direction: new Vector(1 * Math.cos(angle), 1 * Math.sin(angle)).unit() });
		setTimeout(() => (this.wait = true), 1000);
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
	// ! Walls
	// * COLLISION DETECTION
	collision_detection_ball_wall_top() {
		return this.ball.pos.y < Main.BallRadius;
	}
	collision_detection_ball_wall_bottom() {
		return this.ball.pos.y > Main.PongHeight - Main.BallRadius;
	}
	collision_detection_ball_wall_left() {
		if (this.ball.pos.x < Main.BallRadius) {
			this.opponentScore += 1;
			this.playerNoBan += 1;
			this.wait = false;
			this.setup();
		}
	}
	collision_detection_ball_wall_right() {
		if (this.ball.pos.x > Main.PongWidth - Main.BallRadius) {
			this.playerScore += 1;
			this.playerNoBan += 1;
			this.wait = false;
			this.setup();
		}
	}
	// * PENETRATION RESOLUTION
	penetration_resolution_ball_wall_top() {
		const currPos = this.ball.pos;
		this.ball.pos.y = Main.BallRadius;
		this.ball.pos.x = (this.ball.direction.x * (this.ball.pos.y - currPos.y)) / this.ball.direction.y + currPos.x;
	}
	penetration_resolution_ball_wall_bottom() {
		const currPos = this.ball.pos;
		this.ball.pos.y = Main.PongHeight - Main.BallRadius;
		this.ball.pos.x = (this.ball.direction.x * (this.ball.pos.y - currPos.y)) / this.ball.direction.y + currPos.x;
	}
	penetration_resolution_ball_wall_left() {
		const currPos = this.ball.pos;
		this.ball.pos.x = Main.BallRadius;
		this.ball.pos.y = (this.ball.direction.y * (this.ball.pos.x - currPos.x)) / this.ball.direction.x + currPos.y;
	}
	penetration_resolution_ball_wall_right() {
		const currPos = this.ball.pos;
		this.ball.pos.x = Main.PongWidth - Main.BallRadius;
		this.ball.pos.y = (this.ball.direction.y * (this.ball.pos.x - currPos.x)) / this.ball.direction.x + currPos.y;
	}
	// * COLLISION RESPONSE
	collision_response_ball_wall(closest) {
		const normal = this.ball.pos.subtr(closest).unit();
		this.ball.direction = this.ball.direction.subtr(normal.mult(2 * Vector.dot(this.ball.direction, normal)));
		this.sound = true;
	}
	// ! Paddles
	// * COLLISION DETECTION
	collision_detection_ball_paddle(closest) {
		const dist = closest.subtr(this.ball.pos).mag();
		if (dist < Main.PaddleRadius + Main.BallRadius) return true;
		return false;
	}
	// * PENETRATION RESOLUTION
	penetration_resolution_ball_paddle(closest) {
		const penetration = this.ball.pos.subtr(closest);
		this.ball.pos = this.ball.pos.add(penetration.unit().mult(Main.BallRadius + Main.PaddleRadius - penetration.mag()));
	}
	// * COLLISION RESPONSE
	collision_response_ball_paddle_right(closest) {
		const normal = this.ball.pos.subtr(closest).unit();
		this.ball.direction = this.ball.direction
			.subtr(normal.mult(Vector.dot(this.ball.direction, normal)).mult(2))
			.mult(1 + this.rightPaddle.acc.unit().mag() * 0.2);
		if (this.ball.direction.mag() > 2) this.ball.direction = this.ball.direction.unit().mult(2);
		if (Math.abs(this.ball.direction.y) > Math.abs(this.ball.direction.x)) {
			const x = this.ball.direction.x;
			this.ball.direction.x = this.ball.direction.y;
			this.ball.direction.y = x;
		}
		this.sound = true;
	}
	collision_response_ball_paddle_left(closest) {
		const normal = this.ball.pos.subtr(closest).unit();
		this.ball.direction = this.ball.direction
			.subtr(normal.mult(Vector.dot(this.ball.direction, normal)).mult(2))
			.mult(1 + this.leftPaddle.acc.unit().mag() * 0.2);
		if (this.ball.direction.mag() > 2) this.ball.direction = this.ball.direction.unit().mult(2);
		if (Math.abs(this.ball.direction.y) > Math.abs(this.ball.direction.x)) {
			const x = this.ball.direction.x;
			this.ball.direction.x = this.ball.direction.y;
			this.ball.direction.y = x;
		}
		this.sound = true;
	}
	// * Collisions
	closestPointOnLineSigment(point, start, end) {
		const dir = end.subtr(start).unit();
		// * check if the ball is before the line segment
		const ballToWallStart = start.subtr(point);
		if (Vector.dot(dir, ballToWallStart) > 0) return start;
		// * check if the ball is after the line segment
		const wallEndToBall = point.subtr(end);
		if (Vector.dot(dir, wallEndToBall) > 0) return end;
		// * check if the ball is inside the line segment
		const closestDist = Vector.dot(dir, ballToWallStart);
		const closestVect = dir.mult(closestDist);
		return start.subtr(closestVect);
	}
	// * Main Frame
	updateObjects() {
		let closest = this.closestPointOnLineSigment(this.ball.pos, this.TopWall.start, this.TopWall.end);
		if (this.collision_detection_ball_wall_top()) {
			this.penetration_resolution_ball_wall_top();
			this.collision_response_ball_wall(closest);
		}
		closest = this.closestPointOnLineSigment(this.ball.pos, this.BottomWall.start, this.BottomWall.end);
		if (this.collision_detection_ball_wall_bottom()) {
			this.penetration_resolution_ball_wall_bottom();
			this.collision_response_ball_wall(closest);
		}
		this.collision_detection_ball_wall_right();
		this.collision_detection_ball_wall_left();
		if (this.wait) this.ball.reposition();
		closest = this.closestPointOnLineSigment(this.ball.pos, this.rightPaddle.start, this.rightPaddle.end);
		if (this.collision_detection_ball_paddle(closest)) {
			this.penetration_resolution_ball_paddle(closest);
			this.collision_response_ball_paddle_right(closest);
		}
		closest = this.closestPointOnLineSigment(this.ball.pos, this.leftPaddle.start, this.leftPaddle.end);
		if (this.collision_detection_ball_paddle(closest)) {
			this.penetration_resolution_ball_paddle(closest);
			this.collision_response_ball_paddle_left(closest);
		}
		this.rightPaddle.reposition();
		this.leftPaddle.reposition();
	}
	update() {
		if (this.winner !== '') return true;
		this.sound = false;
		this.updateObjects();
		if (this.playerScore >= 7) this.winner = this.opponent;
		else if (this.opponentScore >= 7) this.winner = this.player;
		if (this.playerNoBan >= 5) this.playerNoBan = 1;
		return false;
	}
}
// ! END
