class Vector {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(v: Vector) {
		return new Vector(this.x + v.x, this.y + v.y);
	}

	subtr(v: Vector) {
		return new Vector(this.x - v.x, this.y - v.y);
	}

	mag() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	mult(n: number) {
		return new Vector(this.x * n, this.y * n);
	}

	normal() {
		return new Vector(-this.y, this.x).unit();
	}

	unit() {
		if (this.mag() === 0) return new Vector(0, 0);
		else return new Vector(this.x / this.mag(), this.y / this.mag());
	}

	drawVec(start_x: number, start_y: number, n: number, color: string, ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.moveTo(start_x, start_y);
		ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
		ctx.strokeStyle = color;
		ctx.stroke();
		ctx.closePath();
	}

	static dot(v1: Vector, v2: Vector) {
		return v1.x * v2.x + v1.y * v2.y;
	}

	static cross(v1: Vector, v2: Vector) {
		return v1.x * v2.y - v1.y * v2.x;
	}
}
export function drawVector(
	ctx: CanvasRenderingContext2D,
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	color: string = 'red',
	lineWidth: number = 2,
	arrowSize: number = 10
): void {
	ctx.save();

	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = lineWidth;

	const angle = Math.atan2(endY - startY, endX - startX);

	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(endX, endY);
	ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
	ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
	ctx.closePath();
	ctx.fill();

	ctx.restore();
}
export default Vector;
