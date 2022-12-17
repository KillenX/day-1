const fs = require("fs/promises");

async function loadFile(filename) {
	const fileContent = await fs.readFile(filename, { encoding: "utf8" });
	return fileContent;
}

async function main() {
	const datastream = await loadFile("day6.txt");
	const position = findStartMarker(datastream,14);
	console.log(position);
}

function findStartMarker(stream, windowSize) {
	const buffer = stream.slice(0, windowSize - 1).split("");
	for (let pos = windowSize - 1; pos < stream.length; pos += 1) {
		buffer.push(stream.charAt(pos));
		if (buffer.length > windowSize) {
			buffer.shift();
		}
		if (elementsAreUnique(buffer)) {
			return pos + 1;
		}
	}
}

function elementsAreUnique(buffer) {
	const set = new Set(buffer);
	return buffer.length === set.size;
}

main();
