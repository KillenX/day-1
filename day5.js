const fs = require("fs/promises");

async function loadFile(filename) {
	const fileContent = await fs.readFile(filename, { encoding: "utf8" });
	const lines = fileContent.split("\n");
	lines.pop(); // remove EOF terminator
	return lines;
}

async function main() {
	const fileContent = await loadFile("day5.txt");
	const [stateInput, moveLines] = splitInput(fileContent);
	const state = loadState(stateInput);
	const moves = parseMoves(moveLines);
	const finalState = applyMoves(state, moves);
	printTops(finalState);
}

// The state is separated by an empty line
function splitInput(fileLines) {
	let state = [];
	for (line of fileLines) {
		if (line !== "") {
			state.push(line);
		} else {
			break;
		}
	}
	let moves = fileLines.slice(state.length + 1); //+1 to ignore empty line
	return [state, moves];
}

// return an array, with the stack number being the index
// and the array order being from start to end bottom to top
// add and remove elements to the back of the array
function loadState(initialState) {
	const stackCount = initialState.pop().match(/[\d]+/g).length;
	const stacks = Array(stackCount)
		.fill(0)
		.map(() => Array(0));

	for (line of initialState) {
		for (let stackIndex = 0; stackIndex < stackCount; stackIndex += 1) {
			// each stack takes 4 characters
			const crate = line.charAt(stackIndex * 4 + 1);
			if (crate != " ") {
				stacks[stackIndex].unshift(crate);
			}
		}
	}
	return stacks;
}

// Transforms "move 4 from 2 to 1"
// into an object array
// with each object having
function parseMoves(moveLines) {
	let moves = [];
	for (line of moveLines) {
		moves.push(parseMove(line));
	}
	return moves;
}

function parseMove(move) {
	const [quantity, from, to] = move
		.match(/[\d]+/g)
		.map((num) => Number.parseInt(num));
	return {
		quantity,
		from: from - 1, // 0 index
		to: to - 1,
	};
}

function applyMoves(state, moves) {
	for (const move of moves) {
		applyMove(state, move);
	}
	return state;
}

function applyMove(state, move) {
	const splice = [];
	for (let i = 0; i < move.quantity; i++) {
		splice.unshift(state[move.from].pop());
	}
	state[move.to] = state[move.to].concat(splice);
	return state;
}

function printTops(state) {
	for (stack of state) {
		console.log(stack.pop());
	}
}

main();
