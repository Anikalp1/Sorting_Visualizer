let speed = 0;

class Column {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.queue = [];
		this.color = {
			r: 150,
			g: 150,
			b: 150,
		};
	}

	moveTo(loc, yOffset = 1, frameCount = 20) {
		speed = document.getElementById("speed").value;
		for (let i = 1; i * speed <= frameCount; i++) {
			const t = (i / frameCount) * speed;
			const u = Math.sin(t * Math.PI);
			this.queue.push({
				x: lerp(this.x, loc.x, t),
				y: lerp(this.y, loc.y, t) + ((u * this.width) / 2) * yOffset,
				r: lerp(150, 255, u),
				g: lerp(150, 0, u),
				b: lerp(150, 0, u),
			});
		}
	}

	jump(frameCount = 20) {
		speed = document.getElementById("speed").value;
		for (let i = 1; i * speed <= frameCount; i++) {
			const t = (i / frameCount) * speed;
			const u = Math.sin(t * Math.PI);
			this.queue.push({
				x: this.x,
				y: this.y - u * this.width,
				r: lerp(150, 100, u),
				g: lerp(150, 100, u),
				b: lerp(150, 100, u),
			});
		}
	}

	draw(ctx) {
		let changed = false;
		if (this.queue.length > 0) {
			const { x, y, r, g, b } = this.queue.shift();
			this.x = x;
			this.y = y;
			this.color = { r, g, b };
			changed = true;
		}
		const left = this.x - this.width / 2;
		const top = this.y - this.height;
		const right = this.x + this.width / 2;

		ctx.beginPath();
		const { r, g, b } = this.color;
		ctx.fillStyle = `rgb(${r},${g},${b})`;
		ctx.moveTo(left, top);
		ctx.lineTo(left, this.y);
		ctx.ellipse(
			this.x,
			this.y,
			this.width / 2,
			this.width / 4,
			0,
			Math.PI,
			Math.PI * 2,
			true
		);
		ctx.lineTo(right, top);
		ctx.ellipse(
			this.x,
			top,
			this.width / 2,
			this.width / 4,
			0,
			0,
			Math.PI * 2,
			true
		);
		ctx.fill();
		ctx.stroke();
		return changed;
	}
}
