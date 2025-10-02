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
	reposition(added) {
		this.pos = this.pos.add(this.direction.mult(Main.BallVelocity + added / 2));
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
		this.playerSound = 0;
		this.opponentSound = 0;
		this.keys = new Keys();
		this.ball = new Ball({ direction: new Vector(0, 0) });
		this.rightPaddle = new Paddle({ center: new Vector(0, 0) });
		this.leftPaddle = new Paddle({ center: new Vector(0, 0) });
		this.player = player;
		this.opponent = opponent;
		// * Create Paddles
		this.rightPaddle = new Paddle({ center: new Vector(Main.PongWidth - Main.PaddleDistance, Math.ceil(Main.PongHeight / 2)) });
		this.leftPaddle = new Paddle({ center: new Vector(Main.PaddleDistance, Math.ceil(Main.PongHeight / 2)) });
		this.setup();
	}
	setup() {
		setTimeout(() => (this.wait = true), 2000);
		setTimeout(() => {
			let angle = Main.randInt((-Math.PI / 4) * 1000, (Math.PI / 4) * 1000) / 1000;
			if (this.playerNoBan === 3 || this.playerNoBan === 4) angle += Math.PI;
			this.ball = new Ball({ direction: new Vector(1 * Math.cos(angle), 1 * Math.sin(angle)).unit() });
		}, 1000);
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
	collision_response(normal) {
		this.ball.direction = this.ball.direction.subtr(normal.mult(2 * Vector.dot(this.ball.direction, normal)));
	}
	updateObjects() {
		this.rightPaddle.reposition();
		this.leftPaddle.reposition();
		if (!this.wait) return;
		this.ball.reposition(this.playerScore > this.opponentScore ? this.playerScore : this.opponentScore);
		// * TOP
		if (this.ball.pos.y < Main.BallRadius) {
			this.ball.pos.y = Main.BallRadius;
			this.collision_response(new Vector(0, 1));
			this.opponentSound = 1;
			this.playerSound = 1;
		}
		// * BOTTOM
		if (this.ball.pos.y > Main.PongHeight - Main.BallRadius) {
			this.ball.pos.y = Main.PongHeight - Main.BallRadius;
			this.collision_response(new Vector(0, -1));
			this.opponentSound = 1;
			this.playerSound = 1;
		}
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
				this.opponentSound = 2;
				this.playerSound = 2;
			} else {
				this.playerScore += 1;
				this.playerNoBan += 1;
				this.opponentSound = 3;
				this.playerSound = 4;
				this.wait = false;
				this.setup();
			}
		}
		// * LEFT
		if (this.ball.pos.x < this.leftPaddle.start.x + Main.PaddleRadius + Main.BallRadius) {
			if (this.ball.pos.y + Main.BallRadius > this.leftPaddle.start.y && this.ball.pos.y - Main.BallRadius < this.leftPaddle.end.y) {
				this.ball.pos.x = this.leftPaddle.start.x + Main.PaddleRadius + Main.BallRadius;
				this.collision_response(new Vector(1, 0));
				this.ball.direction.y += this.leftPaddle.acc.y * 0.1;
				this.ball.direction = this.ball.direction.unit();
				this.opponentSound = 2;
				this.playerSound = 2;
			} else {
				this.opponentScore += 1;
				this.playerNoBan += 1;
				this.opponentSound = 4;
				this.playerSound = 3;
				this.wait = false;
				this.setup();
			}
		}
		if (this.playerScore >= Main.FinalScore) this.winner = this.player;
		else if (this.opponentScore >= Main.FinalScore) this.winner = this.opponent;
	}
	update() {
		if (this.winner !== '') return true;
		this.playerSound = 0;
		this.opponentSound = 0;
		this.updateObjects();
		if (this.playerNoBan >= 5) this.playerNoBan = 1;
		return false;
	}
}
// ! END
