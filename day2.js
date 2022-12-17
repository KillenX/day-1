const fs = require("fs/promises");

async function loadFile(filename) {
	const fileContent = await fs.readFile(filename, { encoding: "utf8" });
	return fileContent.split("\n");
}

// play is
// A = rock
// B = Paper
// C = Scissors
// response is
// x = rock
// y = paper
// z = scissors
function calculateScoreOne(strat) {
	if (strat.length === 0) return 0;
	const [play, response] = strat.split(" ");
	const resScore = getResponseScore(response);
	const winScore = getWinScore(play, response);
	return resScore + winScore;
}
// play is
// A = rock
// B = Paper
// C = Scissors
// outcome is
// x = lose
// y = draw
// z = win
function calculateScoreTwo(strat) {
	if (strat.length === 0) return 0;
	const [play, outcome] = strat.split(" ");
	const response = getResFromOutcome(play, outcome);
	const resScore = getResponseScoreTwo(response);
	const winScore = getWinScoreTwo(outcome);
	return resScore + winScore;
}

function getResponseScore(play) {
	switch (play) {
		case "X":
			return 1;
		case "Y":
			return 2;
		case "Z":
			return 3;
	}
}

function getResponseScoreTwo(play) {
	switch (play) {
		case "A":
			return 1;
		case "B":
			return 2;
		case "C":
			return 3;
	}
}

function getWinScoreTwo(outcome) {
	switch (outcome) {
		case "X":
			return 0;
		case "Y":
			return 3;
		case "Z":
			return 6;
	}
}

function getResFromOutcome(play, outcome) {
	if (play == "A") {
		switch (outcome) {
			case "X":
				return "C";
			case "Y":
				return "A";
			case "Z":
				return "B";
		}
	}
	if (play == "B") {
		switch (outcome) {
			case "X":
				return "A";
			case "Y":
				return "B";
			case "Z":
				return "C";
		}
	}
	if (play == "C") {
		switch (outcome) {
			case "X":
				return "B";
			case "Y":
				return "C";
			case "Z":
				return "A";
		}
	}
}

function getWinScore(play, response) {
	if (play == "A") {
		switch (response) {
			case "X":
				return 3;
			case "Y":
				return 6;
			case "Z":
				return 0;
		}
	}
	if (play == "B") {
		switch (response) {
			case "X":
				return 0;
			case "Y":
				return 3;
			case "Z":
				return 6;
		}
	}
	if (play == "C") {
		switch (response) {
			case "X":
				return 6;
			case "Y":
				return 0;
			case "Z":
				return 3;
		}
	}
}

async function main() {
	const strats = await loadFile("day2.txt");

	let score = 0;
	for (const strat of strats) {
		score += calculateScoreTwo(strat);
	}
	console.log("Total score", score);
}

main();
