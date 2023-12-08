import * as fs from "fs";

const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const input = fs.readFileSync(`./${file}`, "utf-8").split("\n");

if (!input) {
  throw new Error(`Error when loading the file`);
}

// PARSING INPUT
const directions: Map<string, number> = new Map([
  ["L", 0],
  ["R", 1],
]);

const sequence: string[] = input.shift()!.split("");
input.shift();

const network: Map<string, [string, string]> = new Map();
input.forEach((line) => {
  const [startingNode, nextNodes] = line.split(" = ");

  const [_, leftNode, rightNode] = [
    ...nextNodes.matchAll(/\(([A-Z]{3}), ([A-Z]{3})\)/g),
  ][0];

  network.set(startingNode, [leftNode, rightNode]);
});

// PART 1
let totalSteps = 0;

let currentStep = "AAA";
while (currentStep !== "ZZZ") {
  sequence.forEach((step) => {
    totalSteps++;
    currentStep = network.get(currentStep)![directions.get(step)!];
  });
}

console.log(`Day 8 part 1 : total steps = ${totalSteps}`);
