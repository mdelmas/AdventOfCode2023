import * as fs from "fs";

enum ReflectionType {
  HORIZONTAL,
  VERTICAL,
}

interface Reflection {
  type: ReflectionType;
  index: number;
}

class Grid {
  content: string[];
  reflection?: Reflection;

  constructor(content: string[]) {
    this.content = content;

    this.findHorizontalReflection();

    if (!this.reflection) {
      this.findVerticalReflection();
    }
  }

  checkHorizontalReflectionAt(line: number) {
    let height = Math.min(line, this.content.length - line);

    let isGoodReflection = true;
    for (let i = 0; i < height; i++) {
      if (this.content[line - 1 - i] !== this.content[line + i]) {
        isGoodReflection = false;
      }
    }

    return isGoodReflection;
  }

  findHorizontalReflection() {
    for (let line = 1; line < this.content.length; line++) {
      if (this.checkHorizontalReflectionAt(line)) {
        this.reflection = {
          type: ReflectionType.HORIZONTAL,
          index: line,
        };
        break;
      }
    }
  }

  getColumnAt(index: number) {
    const column: string[] = [];
    for (let i = 0; i < this.content.length; i++) {
      column.push(this.content[i][index]);
    }
    return column.join("");
  }

  checkVerticalReflectionAt(column: number) {
    let width = Math.min(column, this.content[0].length - column);

    let isGoodReflection = true;
    for (let i = 0; i < width; i++) {
      if (this.getColumnAt(column - 1 - i) !== this.getColumnAt(column + i)) {
        isGoodReflection = false;
      }
    }

    return isGoodReflection;
  }

  findVerticalReflection() {
    for (let column = 1; column < this.content[0].length; column++) {
      if (this.checkVerticalReflectionAt(column)) {
        this.reflection = {
          type: ReflectionType.VERTICAL,
          index: column,
        };
        break;
      }
    }
  }
}

const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const grids = fs
  .readFileSync(`./${file}`, "utf-8")
  .trim()
  .split("\n\n")
  .map((grid) => new Grid(grid.split("\n")));

console.log(
  `Day 13 part 1 : summary of patterns ${grids.reduce(
    (sum: number, grid: Grid) =>
      sum +
      (grid.reflection!.type === ReflectionType.HORIZONTAL
        ? grid.reflection!.index * 100
        : grid.reflection!.index),
    0
  )}`
);
