import Vector from './Vector';

interface Props {
	start: Vector;
	end: Vector;
}

class Wall {
	dir: Vector;
	end: Vector;
	start: Vector;
	center: Vector;
	length: number;

	constructor({ start, end }: Props) {
		this.start = start;
		this.end = end;
		this.dir = this.end.subtr(this.start).unit();
		this.center = this.start.add(this.end).mult(0.5);
		this.length = this.end.subtr(this.start).mag(); // ! Length Might not be needed
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.moveTo(this.start.x, this.start.y);
		ctx.lineTo(this.end.x, this.end.y);
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.closePath();
	}
}

export default Wall;
