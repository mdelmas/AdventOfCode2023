import * as fs from "fs";

const input = fs.readFileSync("./input", "utf-8").split("\n");

const sum: (values: number[]) => number = (values) =>
  values.reduce((sum, value) => sum + value, 0);

// Part 1
const processLinePart1: (line: string) => string = (line) =>
  line.replace(/[a-z]/g, "");

// Part 2
const numberCorrespondances = new Map([
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
]);

const isNumber: (char: string) => boolean = (char) =>
  char >= "0" && char <= "9";

const processLinePart2: (line: string) => string = (line) => {
  let processedLine = "";

  for (let i = 0; i < line.length; i++) {
    // char is a number
    if (isNumber(line[i])) {
      processedLine += line[i];
      continue;
    }

    // char is not a number => check for word correspondance
    for (let [word, number] of numberCorrespondances) {
      if (line.substring(i).startsWith(word)) {
        processedLine += number;
        i += word.length - 2; // eightwo should parse to 82 so keep last letter in
        break;
      }
    }
  }

  return processedLine;
};

const calibrationValuesPart1 = input.map((line) => {
  const lineNumbers = processLinePart1(line);
  return +`${lineNumbers[0]}${lineNumbers[lineNumbers.length - 1]}`;
});

console.log(`Day 1 part 1 answer : ${sum(calibrationValuesPart1)}`);

const calibrationValuesPart2 = input.map((line) => {
  const lineNumbers = processLinePart2(line);
  return +`${lineNumbers[0]}${lineNumbers[lineNumbers.length - 1]}`;
});

console.log(`Day 1 part 2 answer : ${sum(calibrationValuesPart2)}`);
