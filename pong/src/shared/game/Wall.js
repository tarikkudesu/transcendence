export class Wall
{
	dir;
	end;
	start;
	center;
	length;
	constructor({ start, end })
	{
		this.start = start;
		this.end = end;
		this.dir = this.end.subtr(this.start).unit();
		this.center = this.start.add(this.end).mult(0.5);
		this.length = this.end.subtr(this.start).mag(); // ! Length Might not be needed
	}
}
