import * as fs from "fs";
import { processNumbersSequence } from "../utils";

// PROCESS INPUT
const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const valuesHistories = fs
  .readFileSync(`./${file}`, "utf-8")
  .split("\n")
  .map(processNumbersSequence);

const getAllValuesDifferences: (valueHistory: number[]) => number[][] = (
  valueHistory: number[]
) => {
  let allDifferences: number[][] = [valueHistory];

  let lastDifferences = allDifferences[allDifferences.length - 1];
  while (!lastDifferences.every((d) => d === lastDifferences[0])) {
    let nextDifferences: number[] = [];

    lastDifferences.forEach((_, i) => {
      i && nextDifferences.push(lastDifferences[i] - lastDifferences[i - 1]);
    });

    allDifferences.push(nextDifferences);
    lastDifferences = nextDifferences;
  }
  return allDifferences;
};

// PART 1

const predictNextValue: (differences: number[][]) => number = (
  differences: number[][]
) => {
  const endValues = differences.map(
    (differences) => differences[differences.length - 1]
  );
  const calculatedEndValues: number[] = new Array(endValues.length).fill(0);

  endValues.forEach((_, i) => {
    if (i === 0) return (calculatedEndValues[0] = endValues[0]);

    calculatedEndValues[i] = calculatedEndValues[i - 1] + endValues[i];
  });

  return calculatedEndValues[calculatedEndValues.length - 1];
};

const differences = valuesHistories.map(getAllValuesDifferences).reverse();

const predictedValues = differences.map(predictNextValue);
console.log(
  `Day 9 part 1 : sum of predicted values = ${predictedValues.reduce(
    (sum, value) => sum + value
  )}`
);
