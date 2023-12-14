import * as fs from "fs";

enum PipeState {
  DAMAGED = "#",
  OPERATIONAL = ".",
  UNKNOWN = "?",
}

class Row {
  row: string;
  groups: number[];

  numberPossibleCombinations: number = 0;
  numberPossibleCombinationsX5: number = 0;

  constructor({ row, groups }: { row: string; groups: number[] }) {
    this.row = row;
    this.groups = groups;

    if (row.includes(PipeState.UNKNOWN)) {
      this.numberPossibleCombinations = this.generateRowCombination();

      this.numberPossibleCombinationsX5 = this.generateRowCombination(
        row + "?" + row + "?" + row + "?" + row + "?" + row,
        this.groups
          .concat(this.groups)
          .concat(this.groups)
          .concat(this.groups)
          .concat(this.groups)
      );
    }
  }

  // Caching system
  cache: Map<string, number> = new Map();
  cachedGenerateRowCombination(row: string, groups: number[]): number {
    if (this.cache.has(`${row}(${[groups]})`)) {
      return this.cache.get(`${row}(${[groups]})`)!;
    }

    let result = this.generateRowCombination(row, groups);
    this.cache.set(`${row}(${[groups]})`, result);
    return result;
  }

  generateRowCombination(row = this.row, groups = this.groups): number {
    // HANDLE BASE CASE
    if (groups.length === 0 && row.length === 0) {
      return 1;
    }

    // row.length !== 0
    if (groups.length === 0) {
      if (row.includes("#")) {
        return 0;
      }
      return 1;
    }

    // groups.length !== 0
    if (row.length === 0) {
      return 0;
    }

    // HANDLE COMPLEX CASE
    const firstChar = row[0];
    const firstGroup = groups[0];

    const handleDamagedPipe = () => {
      const potentialGroup = row.substring(0, firstGroup).replaceAll("?", "#");

      if (potentialGroup !== PipeState.DAMAGED.repeat(firstGroup)) {
        return 0;
      }

      if (row.length === firstGroup) {
        if (groups.length === 1) {
          return 1;
        }
        return 0;
      }

      if (
        row[firstGroup] === PipeState.OPERATIONAL ||
        row[firstGroup] === PipeState.UNKNOWN
      ) {
        return this.generateRowCombination(
          row.substring(firstGroup + 1),
          groups.slice(1)
        );
      }

      return 0;
    };

    let combinations = 0;

    // firstChar === "."
    if (firstChar === PipeState.OPERATIONAL) {
      combinations = this.cachedGenerateRowCombination(
        row.substring(1),
        groups
      );
    }

    // firstChar === "?"
    if (firstChar === PipeState.UNKNOWN) {
      combinations =
        this.cachedGenerateRowCombination("#" + row.substring(1), groups) +
        this.cachedGenerateRowCombination("." + row.substring(1), groups);
    }

    // firstChar === "#"
    if (firstChar === PipeState.DAMAGED) {
      combinations = handleDamagedPipe();
    }

    return combinations;
  }
}

const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const rows = fs
  .readFileSync(`./${file}`, "utf-8")
  .trim()
  .split("\n")
  .map((line) => {
    const [row, groups] = line.split(" ");
    return new Row({
      row,
      groups: groups.split(",").map((n) => +n),
    });
  });

console.log(
  `Day 12 part 1 : sum of all possible combinations ${rows.reduce(
    (sum: number, currentRow: Row) => {
      return sum + currentRow.numberPossibleCombinations;
    },
    0
  )}`
);

console.log(
  `Day 12 part 2 : sum of all possible combinations with row x5 ${rows.reduce(
    (sum: number, currentRow: Row) => {
      return sum + currentRow.numberPossibleCombinationsX5;
    },
    0
  )}`
);
