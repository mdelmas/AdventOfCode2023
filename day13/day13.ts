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

  findReflection() {
    this.reflection = undefined;

    this.findHorizontalReflection();

    if (!this.reflection) {
      this.findVerticalReflection();
    }
  }

  getColumnAt(index: number) {
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

  checkHorizontalReflectionAt(line: number) {
    let height = Math.min(line, this.content.length - line);

    let difference = 0;
    for (let i = 0; i < height; i++) {
      if (this.content[line - 1 - i] !== this.content[line + i]) {
        difference += this.countDifferences(
          this.content[line - 1 - i],
          this.content[line + i]
        );

        if (difference > MAX_DIFFERENCES) {
          break;
        }
      }
    }

    return difference === MAX_DIFFERENCES;
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

  checkVerticalReflectionAt(column: number) {
    let width = Math.min(column, this.content[0].length - column);

    let difference = 0;
    for (let i = 0; i < width; i++) {
      const firstColumn = this.getColumnAt(column - 1 - i);
      const secondColumn = this.getColumnAt(column + i);

      if (firstColumn !== secondColumn) {
        difference += this.countDifferences(firstColumn, secondColumn);

        if (difference > MAX_DIFFERENCES) {
          break;
        }
      }
    }

    return difference === MAX_DIFFERENCES;
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

// PART 1
grids.forEach((grid) => grid.findReflection());
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
grids.forEach((grid) => grid.findReflection());
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
