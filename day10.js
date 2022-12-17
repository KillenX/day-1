const fs = require("fs/promises");

async function loadFile(filename) {
	const fileContent = await fs.readFile(filename, { encoding: "utf8" });
	const lines = fileContent.split("\n");
	lines.pop(); // remove EOF
	return lines;
}

async function main() {
	const instructions = await loadFile("day10.txt");
	const cpu = new CPU(instructions);
	const crt = new CRT();
	let signalStrenght = 0;
	const breakpoints = [20, 60, 100, 140, 180, 220];

	while (cpu.instructions.length > 0) {
		crt.draw(cpu.x, cpu.cycle);
		cpu.runCycle();
		if (breakpoints.includes(cpu.cycle)) {
			signalStrenght += cpu.cycle * cpu.x;
		}
	}
	console.log("Signal strength: ", signalStrenght);
	crt.print();
}
main();

class CPU {
	x = 1;
	cycle = 0;
	instructions = [];
	processingInstruction;

	constructor(instructions) {
		this.instructions = instructions;
	}

	runCycle() {
		this.cycle += 1;
		if (this.processingInstruction) {
			this.processAddx(this.processingInstruction);
			return;
		}
		const instruction = this.instructions.shift();
		if (instruction === "noop") return;

		if (instruction.startsWith("addx")) {
			this.processingInstruction = instruction;
			return;
		}
	}

	processAddx(instruction) {
		const addxRegex = /addx (-?[0-9]+)/;
		let [_, v] = instruction.match(addxRegex);
		this.x += Number.parseInt(v);
		this.processingInstruction = null;
	}
}

class CRT {
	framebuffer = [];
	print() {
		for (let i = 0; i < 240; i += 40) {
			console.log(this.framebuffer.slice(i, i + 40).join(""));
		}
	}

	draw(spritePosition, cycle) {
		if (Math.abs(spritePosition - (cycle % 40)) <= 1) {
			this.framebuffer.push("#");
		} else {
			this.framebuffer.push(".");
		}
	}
}
