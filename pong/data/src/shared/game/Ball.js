import { Vector } from './Vector.js';

export class Ball {
	pos;
	radius;
	velocity = new Vector(0, 0);
	constructor({ pos, radius, velocity }) {
		this.pos = pos;
		this.radius = radius;
		this.velocity = velocity;
	}
	reposition() {
		this.pos = this.pos.add(this.velocity.mult(10));
	}
}
