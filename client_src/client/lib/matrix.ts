// the only functional programming in the whole project
class Matrix {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	f: number;
	static identity: Matrix;
	constructor(a: number, b: number, c: number, d: number, e: number, f: number) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.e = e;
		this.f = f;
		Object.freeze(this);
	}

	multiply(m2: Matrix) {
		const a1 = this.a,
			b1 = this.b,
			c1 = this.c,
			d1 = this.d,
			e1 = this.e,
			f1 = this.f;

		const a2 = m2.a,
			b2 = m2.b,
			c2 = m2.c,
			d2 = m2.d,
			e2 = m2.e,
			f2 = m2.f;
		// https://www.wolframalpha.com/input/?i=%7B%7Ba,c,e%7D,%7Bb,d,f%7D,%7B0,0,1%7D%7D+*+%7B%7BA,C,E%7D,%7BB,D,F%7D,%7B0,0,1%7D%7D
		return new Matrix(
			a1 * a2 + b2 * c1,
			a2 * b1 + b2 * d1,
			a1 * c2 + c1 * d2,
			b1 * c2 + d1 * d2,
			e1 + a1 * e2 + c1 * f2,
			b1 * e2 + f1 + d1 * f2
		);
	}
	multiply_array(m2: Array<number>) {
		const a1 = this.a,
			b1 = this.b,
			c1 = this.c,
			d1 = this.d,
			e1 = this.e,
			f1 = this.f;
		if (m2 instanceof Array) {
			return [m2[0] * a1 + m2[1] * c1 + e1, m2[0] * b1 + m2[1] * d1 + f1];
		}
	}
	inverse() {
		const a = this.a,
			b = this.b,
			c = this.c,
			d = this.d,
			e = this.e,
			f = this.f;
		// https://www.wolframalpha.com/input/?i=inverse+of+%7B%7Ba,c,e%7D,%7Bb,d,f%7D,%7B0,0,1%7D%7D
		return new Matrix(
			d / (a * d - b * c),
			b / (b * c - a * d),
			c / (b * c - a * d),
			a / (a * d - b * c),
			(d * e - c * f) / (b * c - a * d),
			(b * e - a * f) / (a * d - b * c)
		);
	}

	translate(dx = 0, dy = 0) {
		return this.multiply(new Matrix(1, 0, 0, 1, dx, dy));
	}

	rotate(angle: number, ox = 0, oy = 0) {
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		return this.translate(-ox, -oy).multiply(new Matrix(c, s, -s, c, 0, 0)).translate(ox, oy);
	}

	scale(sx: any, sy: any, ox = 0, oy = 0) {
		if (typeof sy === "undefined") {
			sy = sx;
		}
		return this.translate(-ox, -oy).multiply(new Matrix(sx, 0, 0, sy, 0, 0)).translate(ox, oy);
	}

	equals(other: {a: any; b: any; c: any; d: any; e: any; f: any}) {
		return (
			other.a === this.a &&
			other.b === this.b &&
			other.c === this.c &&
			other.d === this.d &&
			other.e === this.e &&
			other.f === this.f
		);
	}
}

Matrix.identity = new Matrix(1, 0, 0, 1, 0, 0);

module.exports = Matrix;
