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
  numberPossibleCombinations: number = 0;

  rowX2: string;
  possibleCombinationsX2: string[] = [];
  numberPossibleCombinationsX2: number = 0;

  numberPossibleCombinationsX5: number = 0;

  constructor({ row, groups }: { row: string; groups: number[] }) {
    this.row = row;
    this.groups = groups;

    this.rowX2 = row + "?" + row;

    if (row.includes(PipeState.UNKNOWN)) {
      // PART 1 : generate combination
      let allCombinations = this.generateRowCombination();
      this.possibleCombinations = allCombinations.filter((row) =>
        this.checkRowValidity(row)
      );
      // this.possibleCombinations = this.generateRowCombination().filter((row) =>
      //   this.checkRowValidity(row)
      // );
      // this.numberPossibleCombinations = this.possibleCombinations.length;
      console.log("allCombinations", allCombinations);
      // console.log("possibleCombinations", this.possibleCombinations);
      // this.possibleCombinations = [];

      // // PART 2 : generate combinations for doubled row
      // this.possibleCombinationsX2 = this.generateRowCombination(
      //   this.rowX2
      // ).filter((row) => this.checkRowValidity(row, groups.concat(groups)));
      // this.numberPossibleCombinationsX2 = this.possibleCombinationsX2.length;
      // this.possibleCombinationsX2 = [];

      // this.numberPossibleCombinationsX5 =
      //   this.infereNumberPossibleCombinationsX5();
    }
  }

  infereNumberPossibleCombinationsX5() {
    const factor =
      this.numberPossibleCombinationsX2 / this.numberPossibleCombinations;

    let numberPossibleCombinationsX5 = this.numberPossibleCombinationsX2;
    for (let i = 0; i < 3; i++) {
      numberPossibleCombinationsX5 *= factor;
    }

    return numberPossibleCombinationsX5;
  }

  cache: Map<string, string[]> = new Map();

  generateRowCombination(
    replacedRow: string = this.row,
    groups: number[] = [...this.groups],
    inGroup: boolean = false,
    index: number = -1
  ): string[] {
    console.log(replacedRow, groups, inGroup, index);

    // stopping condition
    if (replacedRow.length === 0) {
      return [];
    }

    let combinations: string[] = [];

    const firstChar = replacedRow[0];
    const restOfRow = replacedRow.substring(1) ?? "";

    // FIRST CHAR IS '.'
    if (firstChar === PipeState.OPERATIONAL) {
      inGroup = false;
      if (groups[index] !== 0) {
        return [];
      }

      combinations = [
        ...this.generateRowCombination(restOfRow, groups, inGroup, index),
      ];
    }

    // FIRST CHAR IS '?'
    if (firstChar === PipeState.UNKNOWN) {
      return [
        ...this.generateRowCombination("#" + restOfRow, groups, inGroup, index),
        ...this.generateRowCombination("." + restOfRow, groups, inGroup, index),
      ];
    }

    // FIRST CHAR IS '#'
    if (!inGroup) {
      index++;
      inGroup = true;
    }
    groups[index] -= 1;

    if (groups[index] < 0) {
      return [];
    }
    return this.generateRowCombination(restOfRow, groups, inGroup, index);

    /*
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

    let otherCombinations: string[] = [];
    if (firstChar === PipeState.UNKNOWN) {
      return [this.generateRowCombination];
      // otherCombinations.forEach((combination) => {
      // combinations.push(PipeState.DAMAGED + combination);
      // combinations.push(PipeState.OPERATIONAL + combination);
      // });
      // return otherCombinations;
    }
    if (this.cache.has(restOfRow)) {
      otherCombinations = this.cache.get(restOfRow)!;
    } else {
      otherCombinations = this.generateRowCombination(
        restOfRow,
        groups,
        inGroup,
        groupIndex
      );
      this.cache.set(restOfRow, otherCombinations);
    }
    // }

    if (firstChar === PipeState.DAMAGED) {
      if (!inGroup) {
        groupIndex++;
        inGroup = true;
      }
      groups[groupIndex] -= 1;

      console.log(groups, groups[groupIndex]);

      if (groups[groupIndex] < 0) {
        return [];
      }
    } else {
      inGroup = false;
    }

    otherCombinations.forEach((combination) => {
      combinations.push(combination);
    });
    console.log(combinations);
    return combinations;
    */
  }

  checkRowValidity(row: string = this.row, groups: number[] = this.groups) {
    let damagedSpringsGroups = [...row.matchAll(/(#+)/g)].map(
      (match) => match[0]
    );

    if (damagedSpringsGroups.length !== groups.length) {
      return false;
    }

    for (let i = 0; i < damagedSpringsGroups.length; i++) {
      if (damagedSpringsGroups[i].length !== groups[i]) {
        return false;
      }
    }
    return true;
  }
}

interface Result {
  numberPossibleCombinations: number;
  numberPossibleCombinationsX5: number;
}

const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
// const rows = fs
//   .readFileSync(`./${file}`, "utf-8")
//   .trim()
//   .split("\n")
//   .map((line) => {
//     const [rowInput, groups] = line.split(" ");
//     let row = new Row({
//       row: rowInput,
//       groups: groups.split(",").map((n) => +n),
//     });
//     console.log(row);
//     return {
//       numberPossibleCombinations: row.numberPossibleCombinations,
//       numberPossibleCombinationsX5: row.numberPossibleCombinationsX5,
//     };
//   });
console.log(
  new Row({
    row: "???.###",
    groups: "1,1,3".split(",").map((n) => +n),
  })
);
// const [line, groups] = rows[1].split(" ");
// const row = new Row({
//   row: line,
//   groups: groups.split(",").map((n) => +n),
// });

// console.log(
//   `Day 12 part 1 : sum of all possible combinations ${rows.reduce(
//     (sum: number, current: Result) => {
//       return sum + current.numberPossibleCombinations;
//     },
//     0
//   )}`
// );
// // // console.log(rows.map((row) => row.numberPossibleCombinationsX5));
// console.log(
//   `Day 12 part 2 : sum of all possible combinations with row x5 ${rows.reduce(
//     (sum: number, current: Result) => {
//       return sum + current.numberPossibleCombinationsX5;
//     },
//     0
//   )}`
// );
