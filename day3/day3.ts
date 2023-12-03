import * as fs from "fs";

type Grid = string[];
type Coord = {
  x: number;
  y: number;
};

const grid: Grid = fs.readFileSync("./input", "utf-8").split("\n");

const isNumber: (char: string) => boolean = (char) =>
  char >= "0" && char <= "9";

const isLetter: (char: string) => boolean = (char) =>
  (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");

const isSymbol: (char: string) => boolean = (char) =>
  !isNumber(char) && !isLetter(char) && char !== ".";

const isAdjacentTo: (
  grid: Grid,
  coord: Coord,
  checkFunction: (char: string) => boolean
) => boolean = (grid, coord, checkFunction) => {
  return (
    (coord.y > 0 && checkFunction(grid[coord.y - 1][coord.x])) ||
    (coord.y > 0 &&
      coord.x > 0 &&
      checkFunction(grid[coord.y - 1][coord.x - 1])) ||
    (coord.y > 0 &&
      coord.x < grid[0].length - 1 &&
      checkFunction(grid[coord.y - 1][coord.x + 1])) ||
    (coord.x > 0 && checkFunction(grid[coord.y][coord.x - 1])) ||
    (coord.x < grid[0].length - 1 &&
      checkFunction(grid[coord.y][coord.x + 1])) ||
    (coord.y < grid.length - 1 && checkFunction(grid[coord.y + 1][coord.x])) ||
    (coord.y < grid.length - 1 &&
      coord.x > 0 &&
      checkFunction(grid[coord.y + 1][coord.x - 1])) ||
    (coord.y < grid.length - 1 &&
      coord.x < grid[0].length - 1 &&
      checkFunction(grid[coord.y + 1][coord.x + 1]))
  );
};

const replaceAt: (str: string, i: number, replacement: string) => string = (
  str,
  i,
  replacement
) => {
  return (
    str.substring(0, i) + replacement + str.substring(i + replacement.length)
  );
};

const extractNumber: (coord: Coord) => number = (coord) => {
  let i = coord.x;

  while (i > 0 && isNumber(grid[coord.y][i - 1])) {
    i--;
  }

  let number = grid[coord.y].substring(i).match(/([0-9]+)/)![1];
  grid[coord.y] = replaceAt(grid[coord.y], i, ".".repeat(number.length));

  return +number;
};

const getAdjacentNumber: (coord: Coord) => number[] = (coord) => {
  let adjacentNumbers: number[] = [];

  // check line above
  if (coord.y > 0 && isNumber(grid[coord.y - 1][coord.x])) {
    adjacentNumbers.push(extractNumber({ x: coord.x, y: coord.y - 1 }));
  }

  if (coord.y > 0 && coord.x > 0 && isNumber(grid[coord.y - 1][coord.x - 1])) {
    adjacentNumbers.push(extractNumber({ x: coord.x - 1, y: coord.y - 1 }));
  }

  if (
    coord.y > 0 &&
    coord.x < grid[0].length - 1 &&
    isNumber(grid[coord.y - 1][coord.x + 1])
  ) {
    adjacentNumbers.push(extractNumber({ x: coord.x + 1, y: coord.y - 1 }));
  }

  // check current line
  if (coord.x > 0 && isNumber(grid[coord.y][coord.x - 1])) {
    adjacentNumbers.push(extractNumber({ x: coord.x - 1, y: coord.y }));
  }
  if (coord.x < grid[0].length - 1 && isNumber(grid[coord.y][coord.x + 1])) {
    adjacentNumbers.push(extractNumber({ x: coord.x + 1, y: coord.y }));
  }

  // check line below
  if (coord.y < grid.length - 1 && isNumber(grid[coord.y + 1][coord.x])) {
    adjacentNumbers.push(extractNumber({ x: coord.x, y: coord.y + 1 }));
  }
  if (
    coord.y < grid.length - 1 &&
    coord.x > 0 &&
    isNumber(grid[coord.y + 1][coord.x - 1])
  ) {
    adjacentNumbers.push(extractNumber({ x: coord.x - 1, y: coord.y + 1 }));
  }
  if (
    coord.y < grid.length - 1 &&
    coord.x < grid[0].length - 1 &&
    isNumber(grid[coord.y + 1][coord.x + 1])
  ) {
    adjacentNumbers.push(extractNumber({ x: coord.x + 1, y: coord.y + 1 }));
  }

  return adjacentNumbers;
};

// PART 1

let partsNumbers: number[] = [];

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (isNumber(grid[y][x])) {
      let number = grid[y].substring(x).match(/([0-9]+)/)![1];
      let adjacentToSymbol = false;

      for (let i = 0; i < number.length; i++) {
        if (isAdjacentTo(grid, { x: x + i, y }, isSymbol)) {
          adjacentToSymbol = true;
          break;
        }
      }
      if (adjacentToSymbol) {
        partsNumbers.push(+number);
      }

      x += number.length;
    }
  }
}

const sumOfPartsNumbers = partsNumbers.reduce((sum, number) => sum + number, 0);
console.log(`Day 3 part 1 : sumOfPartsNumbers = ${sumOfPartsNumbers}`);

// PART 2

let gearsRatios: number[] = [];

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "*") {
      let adjacentNumbers = getAdjacentNumber({ x, y });
      if (adjacentNumbers.length === 2) {
        gearsRatios.push(adjacentNumbers[0] * adjacentNumbers[1]);
      }
    }
  }
}

const sumOfPRatios = gearsRatios.reduce((sum, ratio) => sum + ratio, 0);
console.log(`Day 3 part 2 : sumOfPartsNumbers = ${sumOfPRatios}`);
