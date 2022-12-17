const fs = require("fs/promises");

async function loadFile(filename) {
	const fileContent = await fs.readFile(filename, { encoding: "utf8" });
	const lines = fileContent.split("\n");
	lines.pop(); // remove EOF terminator
	return lines;
}

async function main() {
	const input = await loadFile("day8.txt");
	const treeMap = parseTreeMap(input);
	// const visible = checkVisibleTrees(treeMap);
	const maxScenic = getMaxScenicScore(treeMap);
	console.log(maxScenic);
}

main();

/**
 *
 * @param {Array<string>} treeMap
 */
function parseTreeMap(treeMap) {
	const result = treeMap.map((treeLine) =>
		treeLine.split("").map((tree) => Number.parseInt(tree))
	);
	return result;
}

function checkVisibleTrees(treeMap) {
	let visible = 0;
	for (let column = 0; column < treeMap[0].length; column++) {
		for (let row = 0; row < treeMap.length; row++) {
			if (
				treeIsVisibleInRow(treeMap[row], column) ||
				treeIsVisibleInRow(getColumn(treeMap, column), row)
			) {
				visible++;
			}
		}
	}
	return visible;
}

function treeIsVisibleInRow(treeRow, treeIndex) {
	if (treeIndex === 0 || treeRow.length === treeIndex) return true;
	let beforeTrees = treeRow.slice(0, treeIndex);
	let afterTrees = treeRow.slice(treeIndex + 1);
	const higherBefore = beforeTrees.filter(
		(tree) => tree >= treeRow[treeIndex]
	).length;
	const higherAfter = afterTrees.filter(
		(tree) => tree >= treeRow[treeIndex]
	).length;
	return higherBefore == 0 || higherAfter == 0;
}

function getColumn(matrix, column) {
	return matrix.map((row) => row[column]);
}
/**
 *
 * @param {Array<number>} treeRow
 * @param {number} treeIndex
 * @returns
 */
function getScenicScoreForTree(treeRow, treeIndex) {
	let beforeTrees = treeRow.slice(0, treeIndex).reverse();
	let afterTrees = treeRow.slice(treeIndex + 1);
	let treeHeight = treeRow[treeIndex];
	return (
		getScoreForLos(treeHeight, beforeTrees) *
		getScoreForLos(treeHeight, afterTrees)
	);
}

function getScoreForLos(treeHeight, los) {
	if (los.length === 0) return 0;
	let i = 0;
	for (; i < los.length && los[i] < treeHeight; i++) {}
	return Math.min(i + 1, los.length);
}

function getMaxScenicScore(treeMap) {
	let max = 0;
	for (let column = 0; column < treeMap[0].length; column++) {
		for (let row = 0; row < treeMap.length; row++) {
			const scenicRow = getScenicScoreForTree(treeMap[row], column);
			const scenicColumn = getScenicScoreForTree(
				getColumn(treeMap, column),
				row
			);
			if (scenicRow * scenicColumn > max) {
				max = scenicColumn * scenicRow;
			}
		}
	}
	return max;
}
