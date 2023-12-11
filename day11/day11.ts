import { log } from "console";
import * as fs from "fs";

class Coord {
  y: number;

  x: number;

  constructor(y: number, x: number) {
    this.y = y;
    this.x = x;
  }
}

class Galaxy {
  static CHAR = "#";

  id: number;
  coord: Coord;

  constructor(id: number, y: number, x: number) {
    this.id = id;
    this.coord = new Coord(y, x);
  }

  distance = (otherGalaxy: Galaxy) =>
    Math.abs(this.coord.x - otherGalaxy.coord.x) +
    Math.abs(this.coord.y - otherGalaxy.coord.y);
}

class Grid {
  grid: string[][] = [];
  galaxies: Map<number, Galaxy> = new Map();
  distances: number[] = [];

  constructor(input: string) {
    this.grid = input.split("\n").map((line) => line.split(""));

    // expand lines
    this.expand();
    // expand columns
    this.reverse();
    this.expand();
    // then back to initial order
    this.reverse();

    this.defineGalaxies();
  }

  print() {
    for (const [y, line] of this.grid.entries()) {
      for (const [x, cell] of line.entries()) {
        process.stdout.write(cell);
      }
      process.stdout.write("\n");
    }
    process.stdout.write("\n");
  }

  reverse() {
    const reversedGrid: string[][] = [];
    for (let y = 0; y < this.grid[0].length; y++) {
      let column: string[] = [];
      for (let x = 0; x < this.grid.length; x++) {
        column.push(this.grid[x][y]);
      }
      reversedGrid.push(column);
    }
    this.grid = reversedGrid;
  }

  expand() {
    const expandedGrid: string[][] = [];

    this.grid.forEach((line) => {
      if (!line.includes(Galaxy.CHAR)) {
        expandedGrid.push(line);
      }
      expandedGrid.push(line);
    });

    this.grid = expandedGrid;
  }

  defineGalaxies() {
    this.grid.forEach((_, y) => {
      this.grid[y].forEach((_, x) => {
        if (this.grid[y][x] === Galaxy.CHAR) {
          this.galaxies.set(
            this.galaxies.size + 1,
            new Galaxy(this.galaxies.size + 1, y, x)
          );
        }
      });
    });
  }

  calculateDistances() {
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
  `Day 11 part 1 : sume of distances ${grid.distances.reduce(
    (sum, distance) => sum + distance,
    0
  )}`
);
