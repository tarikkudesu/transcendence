import { friction } from './Pong';
import Vector from './Vector';

interface Props {
	constrains: Vector;
	radius: number;
	start: Vector;
	end: Vector;
}

class Paddle {
	start: Vector;
	end: Vector;
	radius: number;
	length: number;
	dir: Vector;
	pos: Vector;
	vel: Vector = new Vector(0, 0);
	acc: Vector = new Vector(0, 0);
	constrains: Vector = new Vector(0, 0);
	acceleration: number = 1.8;
	constructor({ constrains, radius, start, end }: Props) {
		this.constrains = constrains;
		this.radius = radius;
		this.start = start;
		this.end = end;
		this.pos = this.start.add(this.end).mult(0.5);
		this.dir = this.end.subtr(this.start).unit();
		this.length = this.end.subtr(this.start).mag();
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.start.x, this.start.y, this.radius, Math.PI, 2 * Math.PI);
		ctx.arc(this.end.x, this.end.y, this.radius, 2 * Math.PI, Math.PI);
		ctx.closePath();
		ctx.moveTo(this.start.x, this.start.y);
		ctx.lineTo(this.end.x, this.end.y);
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.fillStyle = 'black';
		ctx.fill();
	}

	move(Up: boolean, Down: boolean) {
		if (Up) this.acc = this.dir.mult(-this.acceleration);
		if (Down) this.acc = this.dir.mult(this.acceleration);
		if (!Up && !Down) this.acc = new Vector(0, 0);
	}

	reposition() {
		this.acc = this.acc.unit().mult(this.acceleration);
		this.vel = this.vel.add(this.acc).mult(1 - friction);
		const newPos: Vector = this.pos.add(this.vel);
		if (newPos.y < this.constrains.x) newPos.y = this.constrains.x;
		if (newPos.y > this.constrains.y) newPos.y = this.constrains.y;
		this.pos = newPos;
		this.start = this.pos.add(this.dir.mult(-this.length / 2));
		this.end = this.pos.add(this.dir.mult(this.length / 2));
	}
}

export default Paddle;
