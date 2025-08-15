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

	reposition(added: number): void {
		this.pos = this.pos.add(this.direction.mult(Main.BallVelocity + added / 3));
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
	opponentScore: number;
	intervalId: number = 0;
	rightPaddle: Paddle;
	leftPaddle: Paddle;

	constructor() {
		this.playerScore = 0;
		this.opponentScore = 0;
		this.playerNoBan = 1;
		// * game data
		this.wait = false;
		this.sound = 0;
		this.keys = new Keys();
		this.ball = new Ball({ direction: new Vector(0, 0) });
		this.rightPaddle = new Paddle({ center: new Vector(0, 0) });
		this.leftPaddle = new Paddle({ center: new Vector(0, 0) });
		// * Create Paddles
		this.rightPaddle = new Paddle({ center: new Vector(Main.PongWidth - Main.PaddleDistance, Math.ceil(Main.PongHeight / 2)) });
		this.leftPaddle = new Paddle({ center: new Vector(Main.PaddleDistance, Math.ceil(Main.PongHeight / 2)) });
		this.setup();
	}

	reset(): void {
		this.playerScore = 0;
		this.opponentScore = 0;
		this.playerNoBan = 1;
		// * game data
		this.wait = false;
		this.sound = 0;
		this.keys = new Keys();
		this.ball = new Ball({ direction: new Vector(0, 0) });
		this.rightPaddle = new Paddle({ center: new Vector(0, 0) });
		this.leftPaddle = new Paddle({ center: new Vector(0, 0) });
		// * Create Paddles
		this.rightPaddle = new Paddle({ center: new Vector(Main.PongWidth - Main.PaddleDistance, Math.ceil(Main.PongHeight / 2)) });
		this.leftPaddle = new Paddle({ center: new Vector(Main.PaddleDistance, Math.ceil(Main.PongHeight / 2)) });
		let angle = randInt((-Math.PI / 4) * 1000, (Math.PI / 4) * 1000) / 1000;
		if (this.playerNoBan === 3 || this.playerNoBan === 4) angle += Math.PI;
		this.ball = new Ball({ direction: new Vector(1 * Math.cos(angle), 1 * Math.sin(angle)).unit() });
		setTimeout(() => (this.wait = true), 1000);
	}
	setup(): void {
		let angle = randInt((-Math.PI / 4) * 1000, (Math.PI / 4) * 1000) / 1000;
		if (this.playerNoBan === 3 || this.playerNoBan === 4) angle += Math.PI;
		this.ball = new Ball({ direction: new Vector(1 * Math.cos(angle), 1 * Math.sin(angle)).unit() });
		setTimeout(() => (this.wait = true), 1000);
	}

	keyPressRight(up: boolean, down: boolean): void {
		if (up) this.keys.UP_R = true;
		else this.keys.UP_R = false;
		if (down) this.keys.DOWN_R = true;
		else this.keys.DOWN_R = false;
		this.rightPaddle.move(up, down);
	}

	keyPressLeft(up: boolean, down: boolean): void {
		if (up) this.keys.UP_R = true;
		else this.keys.UP_R = false;
		if (down) this.keys.DOWN_R = true;
		else this.keys.DOWN_R = false;
		this.leftPaddle.move(up, down);
	}

	collision_response(normal: Vector): void {
		this.ball.direction = this.ball.direction.subtr(normal.mult(2 * Vector.dot(this.ball.direction, normal)));
	}

	updateObjects(): void {
		if (this.wait) this.ball.reposition(this.playerScore > this.opponentScore ? this.playerScore : this.opponentScore);
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
				this.sound = 2;
			} else {
				this.opponentScore += 1;
				this.playerNoBan += 1;
				this.sound = 3;
				this.wait = false;
				this.setup();
			}
		}
	}
}

// ! END
const pong: Pong = new Pong();

export default pong;
