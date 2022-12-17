const fs = require("fs");
const readline = require("readline");

async function processLineByLine(filename) {
	const fileStream = fs.createReadStream(filename);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});
	// Note: we use the crlfDelay option to recognize all instances of CR LF
	// ('\r\n') in input.txt as a single line break.
	const caloriesCarried = [];
	let elfSum = 0;
	for await (const line of rl) {
		// Each line in input.txt will be successively available here as `line`.
		if (line == "") {
			caloriesCarried.push(elfSum);
			elfSum = 0;
		} else {
			elfSum += Number.parseInt(line);
		}
	}
	return caloriesCarried;
}

function findMax(arr) {
	let max = 0;
	for (count of arr) {
		if (count > max) {
			max = count;
		}
	}
	return max;
}

function sortArrayDesc(arr) {
	arr.sort(function (a, b) {
		return b - a;
	});
	return arr;
}

async function main() {
	const calories = await processLineByLine("day1.txt");
	const sorted = sortArrayDesc(calories);
	console.log("Max: ", sorted[0]);
	const top3 = sorted[0] + sorted[1] + sorted[2];
	console.log("top3: ", top3);
}

main();
