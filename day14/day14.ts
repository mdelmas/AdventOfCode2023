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

class Grid {
  contentBase: string[][] = [];
  content: string[][] = [];

  constructor(input: string) {
    this.contentBase = input
      .trim()
      .split("\n")
      .map((line) => line.split(""));

    this.resetContent();
  }

  resetContent = () => {
    this.content = JSON.parse(JSON.stringify(this.contentBase));
  };

  print = () => {
    for (const [y, line] of this.content.entries()) {
      for (const [x, tile] of line.entries()) {
        process.stdout.write(tile);
      }
      process.stdout.write("\n");
    }
    process.stdout.write("\n");
  };

  // moving rocks functions
  moveRocksNorth = (coord: Coord) => {
    let y = coord.y;

    while (y > 0 && this.content[y - 1][coord.x] === Tile.EMPTY) {
      y--;
    }

    this.content[coord.y][coord.x] = Tile.EMPTY;
    this.content[y][coord.x] = Tile.ROUND;
  };

  moveRocksWest = (coord: Coord) => {
    let x = coord.x;

    while (x > 0 && this.content[coord.y][x - 1] === Tile.EMPTY) {
      x--;
    }

    this.content[coord.y][coord.x] = Tile.EMPTY;
    this.content[coord.y][x] = Tile.ROUND;
  };

  moveRocksSouth = (coord: Coord) => {
    let y = coord.y;

    while (
      y < this.content.length - 1 &&
      this.content[y + 1][coord.x] === Tile.EMPTY
    ) {
      y++;
    }

    this.content[coord.y][coord.x] = Tile.EMPTY;
    this.content[y][coord.x] = Tile.ROUND;
  };

  moveRocksEast = (coord: Coord) => {
    let x = coord.x;

    while (
      x < this.content[0].length - 1 &&
      this.content[coord.y][x + 1] === Tile.EMPTY
    ) {
      x++;
    }

    this.content[coord.y][coord.x] = Tile.EMPTY;
    this.content[coord.y][x] = Tile.ROUND;
  };

  goThroughSpinCycle = () => {
    // move rocks north
    for (let y = 0; y < this.content.length; y++) {
      for (let x = 0; x < this.content[0].length; x++) {
        if (this.content[y][x] === Tile.ROUND) {
          this.moveRocksNorth({ x, y });
        }
      }
    }

    // than west
    for (let y = 0; y < this.content.length; y++) {
      for (let x = 0; x < this.content[0].length; x++) {
        if (this.content[y][x] === Tile.ROUND) {
          this.moveRocksWest({ x, y });
        }
      }
    }

    // than south
    for (let y = this.content.length - 1; y >= 0; y--) {
      for (let x = 0; x < this.content[0].length; x++) {
        if (this.content[y][x] === Tile.ROUND) {
          this.moveRocksSouth({ x, y });
        }
      }
    }

    // and finally east
    for (let y = 0; y < this.content.length; y++) {
      for (let x = this.content[0].length - 1; x >= 0; x--) {
        if (this.content[y][x] === Tile.ROUND) {
          this.moveRocksEast({ x, y });
        }
      }
    }
  };

  calculateWeights = () => {
    let weight = this.content.length;

    let sumOfWeights = 0;

    this.content.forEach((line) => {
      let countRocks =
        line.join("").match(new RegExp(Tile.ROUND, "g"))?.length || 0;
      sumOfWeights += weight * countRocks;
      weight--;
    });

    return sumOfWeights;
  };
}

const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const grid = new Grid(fs.readFileSync(`./${file}`, "utf-8"));

// PART 1
for (let y = 0; y < grid.content.length; y++) {
  for (let x = 0; x < grid.content[0].length; x++) {
    if (grid.content[y][x] === Tile.ROUND) {
      grid.moveRocksNorth({ x, y });
    }
  }
}
console.log(`Day 14 part 1 : sum of weight = ${grid.calculateWeights()}`);

// PART 2
grid.resetContent();

for (let i = 0; i < CYCLES; i++) {
  grid.goThroughSpinCycle();
}
console.log(`Day 14 part 2 : sum of weight = ${grid.calculateWeights()}`);
