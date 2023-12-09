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

const predictNextValue: (valueHistory: number[]) => number = (
  valueHistory: number[]
) => {
  const differences = getAllValuesDifferences(valueHistory).reverse();
  const lastValues = differences.map(
    (differences) => differences[differences.length - 1]
  );

  const calculatedEndValues: number[] = new Array(lastValues.length).fill(0);

  lastValues.forEach((_, i) => {
    if (i === 0) return (calculatedEndValues[0] = lastValues[0]);

    calculatedEndValues[i] = calculatedEndValues[i - 1] + lastValues[i];
  });

  return calculatedEndValues[calculatedEndValues.length - 1];
};

const predictedValues = valuesHistories.map(predictNextValue);
console.log(
  `Day 9 part 1 : sum of predicted values = ${predictedValues.reduce(
    (sum, value) => sum + value
  )}`
);
