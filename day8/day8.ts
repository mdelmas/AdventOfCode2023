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

let currentNodes: string[] = [];
const network: Map<string, [string, string]> = new Map();
input.forEach((line) => {
  const [startingNode, nextNodes] = line.split(" = ");

  if (startingNode.endsWith("A")) {
    currentNodes.push(startingNode);
  }

  const [_, leftNode, rightNode] = [
    ...nextNodes.matchAll(/\(([A-Z0-9]{3}), ([A-Z0-9]{3})\)/g),
  ][0];

  network.set(startingNode, [leftNode, rightNode]);
});

let totalSteps = 0;
// PART 1
let currentNode = "AAA";
if (!network.get(currentNode)) {
  throw new Error(`Starting node doesn't exist`);
}
while (currentNode !== "ZZZ") {
  sequence.forEach((step) => {
    totalSteps++;
    currentNode = network.get(currentNode)![directions.get(step)!];
  });
}
console.log(`Day 8 part 1 : total steps = ${totalSteps}`);

// PART 2
if (currentNodes.length === 0) {
  throw new Error(`No starting node found`);
}

let steps: number[] = new Array(currentNodes.length).fill(0);
while (
  currentNodes.filter((currentNode) => currentNode.endsWith("Z")).length !==
  currentNodes.length
) {
  sequence.forEach((step) => {
    currentNodes
      .map((currentNode, index) => ({ currentNode, index }))
      .filter(({ currentNode }) => !currentNode.endsWith("Z"))
      .forEach(({ currentNode, index }) => {
        steps[index]++;
        currentNodes[index] = network.get(currentNode)![directions.get(step)!];
      });
  });
}

const greatestCommonDivisor: (a: number, b: number) => number = (
  a: number,
  b: number
) => {
  let [biggest, smallest] = a > b ? [a, b] : [b, a];

  if (smallest === 0) return biggest;
  return greatestCommonDivisor(smallest, biggest % smallest);
};
const leastCommonMultiple = (a: number, b: number) =>
  (a * b) / greatestCommonDivisor(a, b);

console.log(
  `Day 8 part 2 : total steps = ${steps.reduce((totalSteps, currentStep) =>
    leastCommonMultiple(totalSteps, currentStep)
  )}`
);
