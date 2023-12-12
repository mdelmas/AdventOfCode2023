import * as fs from "fs";

enum PipeState {
  DAMAGED = "#",
  OPERATIONAL = ".",
  UNKNOWN = "?",
}

class Row {
  row: string;
  groups: number[];
  possibleCombinations: string[] = [];

  constructor({ row, groups }: { row: string; groups: number[] }) {
    this.row = row;
    this.groups = groups;

    if (row.includes(PipeState.UNKNOWN)) {
      this.possibleCombinations = this.generateRowCombination().filter((row) =>
        this.checkRowValidity(row)
      );
    }
  }

  generateRowCombination(replacedRow: string = this.row): string[] {
    let combinations: string[] = [];

    if (replacedRow.length === 1) {
      if (replacedRow === PipeState.UNKNOWN) {
        combinations.push(PipeState.DAMAGED);
        combinations.push(PipeState.OPERATIONAL);
        return combinations;
      }
      combinations.push(replacedRow);
      return combinations;
    }

    const firstChar = replacedRow[0];
    const restOfRow = replacedRow.substring(1) ?? "";
    var otherCombinations = this.generateRowCombination(restOfRow);

    if (firstChar === PipeState.UNKNOWN) {
      otherCombinations.forEach((combination) => {
        combinations.push(PipeState.DAMAGED + combination);
        combinations.push(PipeState.OPERATIONAL + combination);
      });
    } else {
      otherCombinations.forEach((combination) => {
        combinations.push(firstChar + combination);
      });
    }
    return combinations;
  }

  checkRowValidity(row: string = this.row) {
    let damagedSpringsGroups = [...row.matchAll(/(#+)/g)].map(
      (match) => match[0]
    );

    if (damagedSpringsGroups.length !== this.groups.length) {
      return false;
    }

    for (let i = 0; i < damagedSpringsGroups.length; i++) {
      if (damagedSpringsGroups[i].length !== this.groups[i]) {
        return false;
      }
    }
    return true;
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
      return sum + currentRow.possibleCombinations.length;
    },
    0
  )}`
);
