import * as fs from "fs";
const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const input = fs.readFileSync(`./${file}`, "utf-8").trim().split(",");

const decodeHash = (sequence: string) => {
  return [...sequence].reduce((sum, letter) => {
    return ((sum + letter.charCodeAt(0)) * 17) % 256;
  }, 0);
};

// PART 1
console.log(
  `Day 15 part 1 : sum of hashes = ${input.reduce(
    (sum, sequence) => sum + decodeHash(sequence),
    0
  )}`
);

// PART 2
const boxes: Map<string, number>[] = Array.from(
  { length: 256 },
  (_, index) => new Map()
);

const removeFromBox = (box: number, label: string) => {
  if (boxes[box].has(label)) {
    boxes[box].delete(label);
  }
};

const addToBox = (box: number, label: string, focalLength: number) => {
  boxes[box].set(label, focalLength);
};

input.forEach((sequence) => {
  const [label, focalLength] = sequence.split(/-|=/);
  const box = decodeHash(label);

  if (sequence.includes("=")) {
    addToBox(box, label, +focalLength);
  } else if (sequence.includes("-")) {
    removeFromBox(box, label);
  }
});

let sumFocusingPower = 0;
boxes.forEach((box, boxIndex) => {
  const focalLengths = [...box.values()];

  if (focalLengths.length > 0) {
    focalLengths.forEach((focalLength, slot) => {
      sumFocusingPower += (boxIndex + 1) * (slot + 1) * focalLength;
    });
  }
});
console.log(`Day 15 part 2 : sum of focusing power = ${sumFocusingPower}`);
