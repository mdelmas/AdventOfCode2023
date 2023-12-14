import * as fs from "fs";

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
const grid = fs
  .readFileSync(`./${file}`, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(""));

const printGrid = () => {
  for (const [y, line] of grid.entries()) {
    for (const [x, tile] of line.entries()) {
      process.stdout.write(tile);
    }
    process.stdout.write("\n");
  }
  process.stdout.write("\n");
};

const moveRockNorth = (coord: Coord) => {
  let y = coord.y;

  while (y > 0 && grid[y - 1][coord.x] === Tile.EMPTY) {
    y--;
  }

  grid[coord.y][coord.x] = Tile.EMPTY;
  grid[y][coord.x] = Tile.ROUND;
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

  console.log(sumOfWeights);
};

grid.forEach((line, y) => {
  line.forEach((tile, x) => {
    if (tile === Tile.ROUND) {
      moveRockNorth({ x, y });
    }
  });
});

calculateWeight();
