const fs = require("fs/promises");

async function loadFile(filename) {
	const fileContent = await fs.readFile(filename, { encoding: "utf8" });
	const lines = fileContent.split("\n");
	lines.pop(); // remove EOF
	return lines;
}

async function main() {
	const input = await loadFile("day9test.txt");
	const rope = new Rope();
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
	let [_, direction, count] = movementInput.match(/. [0-9]+/);
	count = Number.parseInt(count);

	for (let i = 0; i < count; i++) {
		rope.move(direction);
		// positionSet.add(rope.head.toString());
		positionSet.add(rope.tail.toString());
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
	head = new Coordinate();
	tail = new Coordinate();

	/**
	 * Which direction to move. Up increses x, right increases y
	 *
	 * @param {string} direction U D R L
	 */
	move(direction) {
		switch (direction) {
			case "U":
				this.head.x += 1;
				break;
			case "D":
				this.head.x -= 1;
				break;
			case "R":
				this.head.y += 1;
				break;
			case "L":
				this.head.y -= 1;
				break;
		}
		this.pullTail();
	}

	pullTail() {
		const diff = this.tail.distance(this.head);

		if (
			diff.getManhattanLength() < 2 || // adjacent
			Math.abs(diff.x) === Math.abs(diff.y) // diagonally adjacent
		) {
			return;
		}

		this.tail.x += Math.sign(diff.x);
		this.tail.y += Math.sign(diff.y);
		// switch (diff.getManhattanLength()) {
		// 	case 0:
		// 		return;
		// 	case 1:
		// 		return;
		// 	case 2:
		// 		if (Math.abs(diff.x) === Math.abs(diff.y)) {
		// 			// They are diagonal
		// 			return;
		// 		} else {
		// 			this.tail.x += Math.sign(diff.x);
		// 			this.tail.y += Math.sign(diff.y);
		// 		}
		// 		return;
		// 	case 3: // Always move one step diagonally
		// 		this.tail.x += Math.sign(diff.x);
		// 		this.tail.y += Math.sign(diff.y);
		// 		return;
		// }
	}
}
