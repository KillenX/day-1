const fs = require("fs/promises");

async function loadFile(filename) {
	const fileContent = await fs.readFile(filename, { encoding: "utf8" });
	return fileContent.split("\n");
}

function getLetterPriority(letter) {
	if (letter >= "a" && letter <= "z") {
		return letter.charCodeAt(0) - "a".charCodeAt(0) + 1;
	}
	if (letter >= "A" && letter <= "Z") {
		return letter.charCodeAt(0) - "A".charCodeAt(0) + 27;
	}
}

function getArrayIntersections(args) {
	const intersection = args.reduce((intersect, member) => {
		let memberSet = new Set(member);
		return new Set([...intersect].filter((i) => memberSet.has(i)));
	}, new Set(args[0]));

	return [...intersection.values()];
}

async function main() {
	const rucksackContents = await loadFile("day3.txt");
	rucksackContents.pop(); // remove final
	let sum = 0;
	for (let i = 0; i < rucksackContents.length; i += 3) {
		const members = rucksackContents.slice(i, i + 3);
		const intersect = processGroup(members);
		sum += getLetterPriority(intersect[0]);
	}

	console.log("Priority sum: ", sum);
}

function processGroup(members) {
	const intersect = getArrayIntersections(
		members.map((member) => member.split(""))
	);
	return intersect;
}

main();

function processBackpack(content) {
	if (content.length === 0) return 0;
	const firstPart = content.slice(0, content.length / 2);
	const secondPart = content.slice(content.length / 2);
	const intersect = getArrayIntersection(
		firstPart.split(""),
		secondPart.split("")
	);
	return getLetterPriority(intersect[0]);
}
