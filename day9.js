const fs = require("fs/promises");

async function loadFile(filename) {
	const fileContent = await fs.readFile(filename, { encoding: "utf8" });
	const lines = fileContent.split("\n");
	lines.pop(); // remove EOF
	return lines;
}

async function main() {
	const input = await loadFile("day9.txt");
	const rope = new Rope(10);
	const positions = new Set();
	for (const movement of input) {
		applyInput(rope, movement, positions);
	}
	console.log(positions.size);
}

main();

/**
 *
 * @param {Rope} rope
 * @param {string} movementInput
 * @param {Set<string>} positionSet
 */
function applyInput(rope, movementInput, positionSet) {
	const movementRegex = /([A-Z]) ([0-9]+)/;
	let [_, direction, count] = movementInput.match(movementRegex);
	count = Number.parseInt(count);

	for (let i = 0; i < count; i++) {
		rope.move(direction);
		positionSet.add(rope.getTail().toString());
	}
}

class Coordinate {
	x;
	y;
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	distance(point) {
		return new Coordinate(this.x - point.x, this.y - point.y);
	}
	getManhattanLength() {
		return Math.abs(this.x) + Math.abs(this.y);
	}
	toString() {
		return `(${this.x},${this.y})`;
	}
}

class Rope {
	knots = [];

	constructor(length = 2) {
		this.knots = Array.from(
			new Array(length).fill(0),
			() => new Coordinate()
		);
	}

	getTail() {
		return this.knots[this.knots.length - 1];
	}

	/**
	 * Which direction to move. Up increses x, right increases y
	 *
	 * @param {string} direction U D R L
	 */
	move(direction) {
		switch (direction) {
			case "U":
				this.knots[0].x += 1;
				break;
			case "D":
				this.knots[0].x -= 1;
				break;
			case "R":
				this.knots[0].y += 1;
				break;
			case "L":
				this.knots[0].y -= 1;
				break;
		}
		for (let i = 0; i < this.knots.length - 1; i++) {
			this.pullTail(this.knots[i], this.knots[i + 1]);
		}
	}

	pullTail(head, tail) {
		const diff = head.distance(tail);

		if (
			diff.getManhattanLength() < 2 || // adjacent
			(Math.abs(diff.x) === 1 && Math.abs(diff.y) === 1) // diagonally adjacent
		) {
			return;
		}

		tail.x += Math.sign(diff.x);
		tail.y += Math.sign(diff.y);

		// Since in the long rope there can be cases of
		if (diff.getManhattanLength() > 3) {
			this.pullTail(head, tail);
		}
	}
}
