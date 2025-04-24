import Vector from './Vector';

interface Props {
	pos: Vector;
	radius: number;
	velocity: Vector;
}

class Ball {
	pos: Vector;
	radius: number;
	velocity: Vector = new Vector(0, 0);

	constructor({ pos, radius, velocity }: Props) {
		this.pos = pos;
		this.radius = radius;
		this.velocity = velocity;
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (ctx === null) return;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.strokeStyle = '#060d17';
		ctx.stroke();
		ctx.fillStyle = '#060d17';
		ctx.fill();
		ctx.closePath();
	}

	reposition() {
		this.pos = this.pos.add(this.velocity.mult(10));
	}
}

export default Ball;
