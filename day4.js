const fs = require("fs/promises");

async function loadFile(filename) {
	const fileContent = await fs.readFile(filename, { encoding: "utf8" });
	return fileContent.split("\n");
}

async function main() {
	const cleaningRanges = await loadFile("day4.txt");
	cleaningRanges.pop(); // remove final EOF
	let sum = 0;
	for (range of cleaningRanges) {
		if (processRange(range)) {
			sum += 1;
		}
	}

	console.log("Ranges: ", sum);
}

function processRange(pairRange) {
	const [first, second] = pairRange.split(",").map(rangeToSectorArray);
	const fullRange = new Set([...first, ...second]);
	return fullRange.size !== first.length + second.length;
}

function rangeToSectorArray(range) {
	const [start, end] = range.split("-").map((num) => Number.parseInt(num));
	return createRange(start, end);
}

function createRange(start, end) {
	const elementCount = Math.abs(end - start) + 1;
	return Array.from(new Array(elementCount), (_, i) => i + start);
}

main();
