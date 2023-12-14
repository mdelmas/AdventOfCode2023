import * as fs from "fs";

const CYCLES = 1000;

enum Tile {
  ROUND = "O",
  CUBE = "#",
  EMPTY = ".",
}

interface Coord {
  x: number;
  y: number;
}

const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const gridBase = fs
  .readFileSync(`./${file}`, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(""));
let grid: string[][] = JSON.parse(JSON.stringify(gridBase));

const printGrid = () => {
  for (const [y, line] of grid.entries()) {
    for (const [x, tile] of line.entries()) {
      process.stdout.write(tile);
    }
    process.stdout.write("\n");
  }
  process.stdout.write("\n");
};

const moveRocksNorth = (coord: Coord) => {
  let y = coord.y;

  while (y > 0 && grid[y - 1][coord.x] === Tile.EMPTY) {
    y--;
  }

  grid[coord.y][coord.x] = Tile.EMPTY;
  grid[y][coord.x] = Tile.ROUND;
};

const moveRocksWest = (coord: Coord) => {
  let x = coord.x;

  while (x > 0 && grid[coord.y][x - 1] === Tile.EMPTY) {
    x--;
  }

  grid[coord.y][coord.x] = Tile.EMPTY;
  grid[coord.y][x] = Tile.ROUND;
};

const moveRocksSouth = (coord: Coord) => {
  let y = coord.y;

  while (y < grid.length - 1 && grid[y + 1][coord.x] === Tile.EMPTY) {
    y++;
  }

  grid[coord.y][coord.x] = Tile.EMPTY;
  grid[y][coord.x] = Tile.ROUND;
};

const moveRocksEast = (coord: Coord) => {
  let x = coord.x;

  while (x < grid[0].length - 1 && grid[coord.y][x + 1] === Tile.EMPTY) {
    x++;
  }

  grid[coord.y][coord.x] = Tile.EMPTY;
  grid[coord.y][x] = Tile.ROUND;
};

const goThroughSpinCycle = () => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === Tile.ROUND) {
        moveRocksNorth({ x, y });
      }
    }
  }

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === Tile.ROUND) {
        moveRocksWest({ x, y });
      }
    }
  }

  for (let y = grid.length - 1; y >= 0; y--) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === Tile.ROUND) {
        moveRocksSouth({ x, y });
      }
    }
  }

  for (let y = 0; y < grid.length; y++) {
    for (let x = grid[0].length - 1; x >= 0; x--) {
      if (grid[y][x] === Tile.ROUND) {
        moveRocksEast({ x, y });
      }
    }
  }
};

const calculateWeight = () => {
  let weight = grid.length;

  let sumOfWeights = 0;

  grid.forEach((line) => {
    let countRocks =
      line.join("").match(new RegExp(Tile.ROUND, "g"))?.length || 0;
    sumOfWeights += weight * countRocks;
    weight--;
  });

  return sumOfWeights;
};

// PART 1
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] === Tile.ROUND) {
      moveRocksNorth({ x, y });
    }
  }
}
console.log(`Day 14 part 1 : sum of weight = ${calculateWeight()}`);

// PART 2
grid = JSON.parse(JSON.stringify(gridBase));

for (let i = 0; i < CYCLES; i++) {
  goThroughSpinCycle();
}
console.log(`Day 14 part 2 : sum of weight = ${calculateWeight()}`);
