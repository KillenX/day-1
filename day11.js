const fs = require("fs/promises");

async function loadFile(filename) {
	return fs.readFile(filename, { encoding: "utf8" });
}

async function main() {
	const input = await loadFile("day11.txt");
	const monkeySetup = input.split("\nMonkey");
	const pack = monkeySetup.map((monkeyInput) => new Monkey(monkeyInput));
	pack.forEach((monkey) => monkey.setPack(pack));
	for (let i = 0; i < 20; i++) {
		doRound(pack);
	}

	pack.forEach((monke, index) =>
		console.log(`${index} inspected items ${monke.inspectionCount} times`)
	);
}
main();

function doRound(pack) {
	for (const monkey of pack) {
		monkey.doTurn();
	}
}

class Monkey {
	items = [];
	operation;
	monkeyPack;
	trueMonkey;
	falseMonkey;
	test;
	inspectionCount = 0;

	/**
	 * @param {string} monkeyInput
	 */
	constructor(monkeyInput) {
		const startingItemsRegex = /Starting items: ([0-9, ]+)/;
		const [_, itemList] = monkeyInput.match(startingItemsRegex);
		this.items = itemList.split(", ").map((num) => Number.parseInt(num));

		const testRegex = /divisible by ([0-9, ]+)/;
		const [__, divisible] = monkeyInput.match(testRegex);
		const divider = Number.parseInt(divisible);
		this.test = (worryLevel) => worryLevel % divider === 0;

		const trueTargetRegex = /If true: throw to monkey ([0-9])/;
		const [___, trueMonkey] = monkeyInput.match(trueTargetRegex);
		this.trueMonkey = Number.parseInt(trueMonkey);

		const falseTargetRegex = /If false: throw to monkey ([0-9])/;
		const [____, falseMonkey] = monkeyInput.match(falseTargetRegex);
		this.falseMonkey = Number.parseInt(falseMonkey);

		const operationRegex = /old (\*|\+) ([0-9]+|old)/;
		let [_____, operation, operand] = monkeyInput.match(operationRegex);

		operand = Number.parseInt(operand);

		if (operation === "+") {
			if (Number.isNaN(operand)) {
				this.operation = (old) => old + old;
			} else {
				this.operation = (old) => old + operand;
			}
		} else {
			if (Number.isNaN(operand)) {
				this.operation = (old) => old * old;
			} else {
				this.operation = (old) => old * operand;
			}
		}
	}

	setPack(monkeyPack) {
		this.monkeyPack = monkeyPack;
	}

	doTurn() {
		while (this.items.length > 0) {
			this.inspect();
		}
	}

	inspect() {
		this.inspectionCount += 1;
		let itemWorryLevel = this.items.shift();
		itemWorryLevel = Math.floor(this.operation(itemWorryLevel) / 3);
		if (this.test(itemWorryLevel)) {
			this.monkeyPack[this.trueMonkey].giveItem(itemWorryLevel);
		} else {
			this.monkeyPack[this.falseMonkey].giveItem(itemWorryLevel);
		}
	}

	giveItem(item) {
		this.items.push(item);
	}
}
