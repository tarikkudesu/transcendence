export class Vector
{
	x;
	y;
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
	add(v)
	{
		return new Vector(this.x + v.x, this.y + v.y);
	}
	subtr(v)
	{
		return new Vector(this.x - v.x, this.y - v.y);
	}
	mag()
	{
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}
	mult(n)
	{
		return new Vector(this.x * n, this.y * n);
	}
	normal()
	{
		return new Vector(-this.y, this.x).unit();
	}
	unit()
	{
		if (this.mag() === 0) return new Vector(0, 0);
		else return new Vector(this.x / this.mag(), this.y / this.mag());
	}
	static dot(v1, v2)
	{
		return v1.x * v2.x + v1.y * v2.y;
	}

	static cross(v1, v2)
	{
		return v1.x * v2.y - v1.y * v2.x;
	}
}
