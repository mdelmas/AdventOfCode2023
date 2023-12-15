import * as fs from "fs";
const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const input = fs.readFileSync(`./${file}`, "utf-8").trim().split(",");

const decodeHash = (sequence: string) => {
  return [...sequence].reduce((sum, letter) => {
    return ((sum + letter.charCodeAt(0)) * 17) % 256;
  }, 0);
};

console.log(
  `Day 15 part 1 : sum of hashes = ${input.reduce(
    (sum, sequence) => sum + decodeHash(sequence),
    0
  )}`
);
