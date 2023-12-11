import { log } from "console";
import * as fs from "fs";

const GALAXY_CHAR = "#";
const CELL_CHAR = ".";

let factor = 1000000; // 1000000;
class Coord {
  y: number;
  x: number;

  constructor(y: number, x: number) {
    this.y = y;
    this.x = x;
  }

  updateX(x: number) {
    this.x = x;
  }

  updateY(y: number) {
    this.y = y;
  }
}
class CellDimension {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  expandWidth() {
    this.width = factor;
  }
  expandHeight() {
    this.height = factor;
  }
}

class Cell {
  char = CELL_CHAR;

  coord: Coord;
  dimension: CellDimension;

  constructor(y: number, x: number, width: number = 1, height: number = 1) {
    this.coord = new Coord(y, x);
    this.dimension = new CellDimension(width, height);
  }
}

class Galaxy extends Cell {
  char = GALAXY_CHAR;

  id: number;

  constructor(id: number, y: number, x: number) {
    super(y, x);
    this.id = id;
  }

  distance = (otherGalaxy: Galaxy) =>
    Math.abs(this.coord.x - otherGalaxy.coord.x) +
    Math.abs(this.coord.y - otherGalaxy.coord.y);
}

class Grid {
  grid: Cell[][] = [];
  galaxies: Map<number, Galaxy> = new Map();
  distances: number[] = [];

  constructor(input: string) {
    this.grid = input.split("\n").map((line, y) =>
      line.split("").map((cell, x) => {
        if (cell === GALAXY_CHAR) {
          let galaxy = new Galaxy(this.galaxies.size + 1, y, x);
          this.galaxies.set(this.galaxies.size + 1, galaxy);
          return galaxy;
        }

        return new Cell(y, x);
      })
    );

    // expand lines + columns
    this.expand();
    // recalculate coordinates
    this.recalculateCoordinates();
  }

  print() {
    for (const [y, line] of this.grid.entries()) {
      for (const [x, cell] of line.entries()) {
        if (
          !(this.grid[y][x] instanceof Galaxy) &&
          cell.dimension.width > 1 &&
          cell.dimension.height > 1
        ) {
          process.stdout.write("*");
        } else if (
          !(this.grid[y][x] instanceof Galaxy) &&
          (cell.dimension.width > 1 || cell.dimension.height > 1)
        ) {
          process.stdout.write("x");
        } else {
          process.stdout.write(cell.char);
        }
      }
      process.stdout.write("\n");
    }
    process.stdout.write("\n");
  }

  reverse() {
    const reversedGrid: Cell[][] = [];

    for (let y = 0; y < this.grid[0].length; y++) {
      let column: Cell[] = [];

      for (let x = 0; x < this.grid.length; x++) {
        column.push(this.grid[x][y]);
      }

      reversedGrid.push(column);
    }

    this.grid = reversedGrid;
  }

  expand() {
    // expand lines
    this.grid.forEach((_, y) => {
      let hasGalaxy = false;

      this.grid[y].forEach((_, x) => {
        hasGalaxy = this.grid[y][x] instanceof Galaxy || hasGalaxy;
      });

      if (!hasGalaxy) {
        this.grid[y].forEach((_, x) => {
          this.grid[y][x].dimension.expandHeight();
        });
      }
    });

    // expand columns
    this.grid[0].forEach((_, x) => {
      let hasGalaxy = false;

      this.grid.forEach((_, y) => {
        hasGalaxy = this.grid[y][x] instanceof Galaxy || hasGalaxy;
      });

      if (!hasGalaxy) {
        this.grid.forEach((_, y) => {
          this.grid[y][x].dimension.expandWidth();
        });
      }
    });
  }

  recalculateCoordinates() {
    // recalculate for lines
    this.grid.forEach((_, y) => {
      let distanceFromStart = 0;

      this.grid[y].forEach((_, x) => {
        if (this.grid[y][x] instanceof Galaxy) {
          this.grid[y][x].coord.updateX(distanceFromStart);
        }

        distanceFromStart += this.grid[y][x].dimension.width;
      });
    });

    // recalculate for columns
    this.grid[0].forEach((_, x) => {
      let distanceFromTop = 0;
      this.grid.forEach((_, y) => {
        if (this.grid[y][x] instanceof Galaxy) {
          this.grid[y][x].coord.updateY(distanceFromTop);
        }

        distanceFromTop += this.grid[y][x].dimension.height;
      });
    });
  }

  calculateDistances() {
    this.distances = [];

    for (let i = 1; i < this.galaxies.size; i++) {
      const galaxy = this.galaxies.get(i)!;

      for (let j = i + 1; j <= this.galaxies.size; j++) {
        const otherGalaxy = this.galaxies.get(j)!;
        this.distances.push(galaxy.distance(otherGalaxy));
      }
    }
  }
}

const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const input = fs.readFileSync(`./${file}`, "utf-8");
const grid = new Grid(input);

grid.calculateDistances();
console.log(
  `Day 11 part 2 : sume of distances ${grid.distances.reduce(
    (sum, distance) => sum + distance,
    0
  )}`
);
