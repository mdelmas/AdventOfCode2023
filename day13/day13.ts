import * as fs from "fs";

enum ReflectionType {
  HORIZONTAL,
  VERTICAL,
}

let MAX_DIFFERENCES = 0;

interface Reflection {
  type: ReflectionType;
  index: number;
}

class Grid {
  content: string[];
  reflection?: Reflection;

  constructor(content: string[]) {
    this.content = content;
  }

  findAllReflections() {
    this.reflection = undefined;

    this.findReflection(ReflectionType.HORIZONTAL);

    if (!this.reflection) {
      this.findReflection(ReflectionType.VERTICAL);
    }
  }

  getLine(index: number, type: ReflectionType) {
    if (type === ReflectionType.HORIZONTAL) {
      return this.content[index];
    }

    const column: string[] = [];
    for (let i = 0; i < this.content.length; i++) {
      column.push(this.content[i][index]);
    }
    return column.join("");
  }

  countDifferences(line1: string, line2: string) {
    let differences = 0;
    for (let i = 0; i < line1.length; i++) {
      if (line1[i] !== line2[i]) {
        differences++;
      }
    }
    return differences;
  }

  checkReflection(line: number, type: ReflectionType) {
    let maxLength =
      type === ReflectionType.HORIZONTAL
        ? this.content.length
        : this.content[0].length;
    let range = Math.min(line, maxLength - line);

    let difference = 0;
    for (let i = 0; i < range; i++) {
      const firstLine = this.getLine(line - 1 - i, type);
      const secondLine = this.getLine(line + i, type);

      if (firstLine !== secondLine) {
        difference += this.countDifferences(firstLine, secondLine);

        if (difference > MAX_DIFFERENCES) {
          break;
        }
      }
    }

    return difference === MAX_DIFFERENCES;
  }

  findReflection(type: ReflectionType) {
    let range =
      type === ReflectionType.HORIZONTAL
        ? this.content.length
        : this.content[0].length;

    for (let index = 1; index < range; index++) {
      if (this.checkReflection(index, type)) {
        this.reflection = { type, index };
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

// PART 1
grids.forEach((grid) => grid.findAllReflections());
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

// PART 2
MAX_DIFFERENCES = 1;
grids.forEach((grid) => grid.findAllReflections());
console.log(
  `Day 13 part 2 : summary of patterns ${grids.reduce(
    (sum: number, grid: Grid) =>
      sum +
      (grid.reflection!.type === ReflectionType.HORIZONTAL
        ? grid.reflection!.index * 100
        : grid.reflection!.index),
    0
  )}`
);
