import * as fs from "fs";

enum Cell {
  EMPTY = ".",
  ENERGIZED = "#",
  LEFT_MIRROR = "\\",
  RIGHT_MIRROR = "/",
  HORIZONTAL_SPLITTER = "-",
  VERTICAL_SPLITTER = "|",
}

enum Direction {
  UP = "U",
  RIGHT = "R",
  DOWN = "D",
  LEFT = "L",
}

interface Coord {
  x: number;
  y: number;
}

class Beam {
  coord: Coord;
  direction: Direction;

  constructor({
    coord,
    direction = Direction.RIGHT,
  }: {
    coord: Coord;
    direction?: Direction;
  }) {
    this.coord = coord;
    this.direction = direction;
  }
}

class Game {
  grid: string[][];
  visited: Direction[][][];
  beams: Beam[] = [];

  constructor(input: string) {
    this.grid = input
      .trim()
      .split("\n")
      .map((line) => line.split(""));

    this.visited = [...Array(this.grid.length)].map(() =>
      [...Array(this.grid[0].length)].map(() => [])
    );
  }

  printGrid = (grid: string[][] = this.grid) => {
    process.stdout.write(
      "  " + [...Array(grid[0].length)].map((_, i) => i % 10).join("") + "\n"
    );

    for (const [y, line] of grid.entries()) {
      process.stdout.write((y % 10) + " ");

      for (const [x, tile] of line.entries()) {
        if (this.visited[y][x].length > 0) {
          process.stdout.write("x");
        } else {
          process.stdout.write(tile);
        }
      }
      process.stdout.write("\n");
    }
    process.stdout.write("\n");
  };

  calculateNextPosStraight = (beam: Beam) => {
    let newCoord = { ...beam.coord };

    switch (beam.direction) {
      case Direction.UP:
        if (beam.coord.y > 0) {
          newCoord.y--;
        }
        break;

      case Direction.DOWN:
        if (beam.coord.y < this.grid.length - 1) {
          newCoord.y++;
        }
        break;

      case Direction.RIGHT:
        if (beam.coord.x < this.grid[0].length - 1) {
          newCoord.x++;
        }
        break;

      case Direction.LEFT:
        if (beam.coord.x > 0) {
          newCoord.x--;
        }
        break;
    }

    if (JSON.stringify(beam.coord) === JSON.stringify(newCoord)) {
      return null;
    }

    beam.coord = newCoord;
    return newCoord;
  };

  calculateNextPos = (beam: Beam) => {
    if (this.visited[beam.coord.y][beam.coord.x].includes(beam.direction)) {
      return null;
    } else {
      this.visited[beam.coord.y][beam.coord.x].push(beam.direction);
    }

    // HANDLE SPLITTERS
    if (
      this.grid[beam.coord.y][beam.coord.x] === Cell.VERTICAL_SPLITTER &&
      (beam.direction === Direction.RIGHT || beam.direction === Direction.LEFT)
    ) {
      // need to split beam and go up and down
      this.beams.push(new Beam({ coord: beam.coord, direction: Direction.UP }));
      this.beams.push(
        new Beam({ coord: beam.coord, direction: Direction.DOWN })
      );
      return null;
    }

    if (
      this.grid[beam.coord.y][beam.coord.x] === Cell.HORIZONTAL_SPLITTER &&
      (beam.direction === Direction.UP || beam.direction === Direction.DOWN)
    ) {
      // need to split beam and go right and left
      this.beams.push(
        new Beam({ coord: beam.coord, direction: Direction.RIGHT })
      );
      this.beams.push(
        new Beam({ coord: beam.coord, direction: Direction.LEFT })
      );
      return null;
    }

    // HANDLE RIGHT MIRROR
    if (this.grid[beam.coord.y][beam.coord.x] === Cell.RIGHT_MIRROR) {
      if (beam.direction === Direction.UP) {
        beam.direction = Direction.RIGHT;
      } else if (beam.direction === Direction.RIGHT) {
        beam.direction = Direction.UP;
      } else if (beam.direction === Direction.DOWN) {
        beam.direction = Direction.LEFT;
      } else if (beam.direction === Direction.LEFT) {
        beam.direction = Direction.DOWN;
      }
    }

    // HANDLE LEFT MIRROR
    if (this.grid[beam.coord.y][beam.coord.x] === Cell.LEFT_MIRROR) {
      if (beam.direction === Direction.UP) {
        beam.direction = Direction.LEFT;
      } else if (beam.direction === Direction.RIGHT) {
        beam.direction = Direction.DOWN;
      } else if (beam.direction === Direction.DOWN) {
        beam.direction = Direction.RIGHT;
      } else if (beam.direction === Direction.LEFT) {
        beam.direction = Direction.UP;
      }
    }

    return this.calculateNextPosStraight(beam);
  };

  calculateBeamsTrajectories = () => {
    while (this.beams.length > 0) {
      let beam = this.beams.shift()!;

      while (this.calculateNextPos(beam)) {}
    }
  };

  countEnergizedCells = () => {
    let count = 0;
    for (const [y, line] of this.visited.entries()) {
      for (const [x, tile] of line.entries()) {
        if (tile.length > 0) {
          count++;
        }
      }
    }
    return count;
  };
}

const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const game = new Game(fs.readFileSync(`./${file}`, "utf-8"));

game.beams.push(new Beam({ coord: { x: 0, y: 0 } }));
game.calculateBeamsTrajectories();
console.log(
  `Day 16 part 1 : count of energized cells = ${game.countEnergizedCells()}`
);
