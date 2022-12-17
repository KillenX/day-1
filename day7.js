const fs = require("fs/promises");

async function loadFile(filename) {
	const fileContent = await fs.readFile(filename, { encoding: "utf8" });
	const lines = fileContent.split("\n");
	lines.pop(); // remove EOF terminator
	return lines;
}

async function main() {
	const totalStorageSize = 70000000;
	const requiredFreeStorage = 30000000;
	const terminalLog = await loadFile("day7.txt");
	const commands = parseLogIntoCommands(terminalLog);
	const fileSystem = createFileTreeFromCommands(commands);
	// calculates the sizes of directories
	calculateDirSize(fileSystem);
	const usedSpace = fileSystem.size;
	const requiredDeletion =
		requiredFreeStorage - (totalStorageSize - usedSpace);

	const result = [];
	findBiggerDir(fileSystem, requiredDeletion, result);
	const smallest = result.reduce((currentMin, element) => {
		if (element.size < currentMin.size) {
			return element;
		}
		return currentMin;
	}, fileSystem);

	console.log(smallest.name, smallest.size);
}

main();

// command parsing
function parseLogIntoCommands(terminalLog) {
	const commands = [];
	let currentCommand;

	for (const line of terminalLog) {
		if (lineIsCommand(line)) {
			currentCommand = parseCommand(line);
			commands.push(currentCommand);
		} else {
			currentCommand.output.push(line);
		}
	}
	return commands;
}

function lineIsCommand(line) {
	return line.startsWith("$");
}

function parseCommand(line) {
	const commandRegex = /\$ ([a-z]+) ?(.*)/;
	const [_, command, args] = line.match(commandRegex);
	return {
		command,
		args,
		output: [],
	};
}

// File system
function createFileTreeFromCommands(commands) {
	// node has name size and children
	const root = {
		name: "/",
		size: 0,
		isDir: true,
		children: [],
	};

	let workingDir = ["/"];
	for (const command of commands) {
		if (command.command == "cd") {
			workingDir = processCd(command, workingDir);
		} else if (command.command === "ls") {
			const filesInDir = processLs(command, root, workingDir);
			assembleFs(root, workingDir, filesInDir);
		}
	}
	return root;
}

function processCd(command, currentWorkingDir) {
	if (command.args === "..") {
		if (currentWorkingDir.length > 1) {
			currentWorkingDir.pop();
		}
	} else if (command.args === "/") {
		currentWorkingDir = ["/"];
	} else {
		currentWorkingDir.push(command.args);
	}
	return currentWorkingDir;
}

function processLs(command) {
	const files = [];
	for (const line of command.output) {
		if (line.startsWith("dir")) {
			files.push(processDir(line));
		} else {
			files.push(processFile(line));
		}
	}
	return files;
}

function processDir(line) {
	const [_, name] = line.match(/dir ([a-zA-Z.]+)/);
	return {
		name,
		size: 0,
		isDir: true,
		children: [],
	};
}

function processFile(line) {
	const [_, size, name] = line.match(/([0-9]+) ?([a-zA-Z.]+)/);
	return {
		name,
		size: Number.parseInt(size),
		isDir: false,
		children: [],
	};
}

function assembleFs(root, workingDir, filesInDir) {
	const currentNode = findNode(root, workingDir);
	for (file of filesInDir) {
		currentNode.children.push(file);
	}
}

function findNode(root, workingDir) {
	let file = root;
	for (pathElement of workingDir) {
		if (pathElement !== "/") {
			file = file.children.find((child) => child.name === pathElement);
		}
	}
	return file;
}

function calculateDirSize(dir) {
	if (!dir.isDir) return dir.size;

	let sum = 0;
	for (child of dir.children) {
		sum += calculateDirSize(child);
	}
	dir.size = sum;
	return sum;
}

function traverseFs(root, limit, sum) {
	if (root.isDir && root.size < limit) {
		sum.total += root.size;
	}
	for (child of root.children) {
		traverseFs(child, limit, sum);
	}
}

function findBiggerDir(fsElement, requiredSize, result) {
	if (fsElement.isDir && fsElement.size > requiredSize) {
		result.push(fsElement);
	}
	for (child of fsElement.children) {
		findBiggerDir(child, requiredSize, result);
	}
}
