import * as fs from "fs";
import { processNumbersSequence } from "../utils";

type Coord = {
  x: number;
  y: number;
};

enum Tile {
  VERTICAL = "|",
  HORIZONTAL = "-",
  BOTTOM_LEFT = "L",
  BOTTOM_RIGHT = "J",
  TOP_RIGHT = "7",
  TOP_LEFT = "F",
  NONE = ".",
  STARTER = "S",
  VISITED = "X",
}

enum Directions {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}
const directions: Directions[] = Object.values(Directions)
  .filter((d) => typeof d === "number")
  .map((d) => d as Directions);

const tilesDirections: {
  [index: string]: { in: Directions[]; out: Directions[] };
} = {
  "|": {
    in: [Directions.UP, Directions.DOWN],
    out: [Directions.UP, Directions.DOWN],
  }, // is a vertical pipe connecting north and south
  "-": {
    in: [Directions.RIGHT, Directions.LEFT],
    out: [Directions.RIGHT, Directions.LEFT],
  }, //is a horizontal pipe connecting east and west
  L: {
    in: [Directions.DOWN, Directions.LEFT],
    out: [Directions.UP, Directions.RIGHT],
  }, // is a 90-degree bend connecting north and east
  J: {
    in: [Directions.DOWN, Directions.RIGHT],
    out: [Directions.UP, Directions.LEFT],
  }, // is a 90-degree bend connecting north and west
  "7": {
    in: [Directions.UP, Directions.RIGHT],
    out: [Directions.DOWN, Directions.LEFT],
  }, // is a 90-degree bend connecting south and west
  F: {
    in: [Directions.UP, Directions.LEFT],
    out: [Directions.DOWN, Directions.RIGHT],
  }, // is a 90-degree bend connecting south and east
  ".": { in: [], out: [] }, // is ground
  X: { in: [], out: [] }, // visited
  S: {
    in: [],
    out: [Directions.UP, Directions.RIGHT, Directions.DOWN, Directions.LEFT],
  }, // is the starting position of the animal
};
console.log(tilesDirections);

// PROCESS INPUT
const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const grid = fs
  .readFileSync(`./${file}`, "utf-8")
  .split("\n")
  .map((line) => line.split(""));
console.log(grid);

const findStartCoord = () => {
  for (const [y, line] of grid.entries()) {
    for (const [x, tile] of line.entries()) {
      if (tile === Tile.STARTER) {
        return { x, y };
      }
    }
  }
};

const getCoordInDirection = (coord: Coord, direction: Directions) => {
  switch (direction) {
    case Directions.UP:
      if (coord.y <= 0) {
        return undefined;
      }
      return { y: coord.y - 1, x: coord.x };
    case Directions.DOWN:
      if (coord.y >= grid.length) {
        return undefined;
      }
      return { y: coord.y + 1, x: coord.x };
    case Directions.RIGHT:
      if (coord.x >= grid[0].length) {
        return undefined;
      }
      return { y: coord.y, x: coord.x + 1 };
    case Directions.LEFT:
      if (coord.x <= 0) {
        return undefined;
      }
      return { y: coord.y, x: coord.x - 1 };
  }
};

const findPossibleCoord = (coord: Coord) => {
  const currentTile = grid[coord.y][coord.x];
  grid[coord.y][coord.x] = Tile.VISITED;
  console.log(currentTile, tilesDirections[currentTile]);

  for (const direction of tilesDirections[currentTile].out) {
    const nextCoord = getCoordInDirection(coord, direction);
    if (nextCoord === undefined) {
      continue;
    }

    console.log(`${direction}, tile = ${grid[nextCoord.y][nextCoord.x]} :)`);

    if (
      tilesDirections[grid[nextCoord.y][nextCoord.x]]!.in.includes(direction)
    ) {
      steps++;
      console.log(
        `You can get in direction ${direction}, tile = ${
          grid[nextCoord.y][nextCoord.x]
        } :)`
      );

      return nextCoord;
    }
  }
  return undefined;
};

let coord = findStartCoord();
console.log(coord);
// console.log(findPossibleCoords(start));
console.log(grid);

let steps = 0;

while (coord) {
  coord = findPossibleCoord(coord!);
  console.log(steps);
}

console.log(Math.floor((steps + 1) / 2));
