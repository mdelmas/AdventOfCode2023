import * as fs from "fs";

interface Range {
  start: number;
  end: number;
}

const input: string[] = fs
  .readFileSync("./input", "utf-8")
  .split("\n")
  .filter((line) => !!line);
let seeds = input
  .shift()!
  .split(":")[1]
  .trim()
  .split(/\s+/)
  .map((seed) => +seed);
let modifiedSeeds = seeds.map((seed) => seed); // copy of seeds to modify a seed only once (only basing myself on the initial value of seed)

const steps = [
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
];
let currentStep = -1;

for (const line of input) {
  if (line.startsWith(steps[currentStep + 1])) {
    currentStep++;

    seeds = modifiedSeeds; // save modified seed
    modifiedSeeds = seeds.map((seed) => seed); // and copy the array again to save the new ones

    continue;
  }

  // else process the mapping
  // line: destination range start, source range start, range length
  const [startDestinationRange, startSourceRange, rangeLength] = line
    .split(/\s+/)
    .map((n) => +n);

  seeds.forEach((seed, index) => {
    if (seed >= startSourceRange && seed < startSourceRange + rangeLength) {
      modifiedSeeds[index] = seed + (startDestinationRange - startSourceRange);
    }
  });
}

seeds = modifiedSeeds; // save modified seed
console.log(`Day 5 part 1 : min location = ${Math.min(...seeds)}`);

// input.shift();
/*
// let seedsRanges: Range[] = [];
// seeds.forEach((_, index) => {
//   if (index % 2 !== 0) return;

//   const [startRange, rangeLength] = seeds.slice(index);
//   seedsRanges.push({ start: startRange, end: startRange + rangeLength - 1 });
// });
// let modifiedSeedsRanges = seedsRanges.map((seed) => ({ ...seed })); // copy of seeds to modify a seed only once (only basing myself on the initial value of seed)
// console.log("starting ranges", seedsRanges);


for (const line of input) {
  if (line.startsWith(steps[currentStep + 1])) {
    currentStep++;

    seedsRanges = modifiedSeedsRanges; // save modified seed
    modifiedSeedsRanges = seedsRanges.map((seed) => ({ ...seed }));

    console.log("new step", steps[currentStep], "\tranges", seedsRanges);

    continue;
  }

  // else process the mapping
  // line: destination range start, source range start, range length
  const [startDestinationRange, startSourceRange, rangeLength] = line
    .split(/\s+/)
    .map((n) => +n);
  console.log(startDestinationRange, startSourceRange, rangeLength);

  const transformation = startDestinationRange - startSourceRange;
  const sourceRange = {
    start: startSourceRange,
    end: startSourceRange + rangeLength - 1,
  };

  seedsRanges.forEach((seedsRange, index) => {
    if (
      seedsRange.start >= sourceRange.start &&
      seedsRange.end <= sourceRange.end
    ) {
      console.log("modifying range 1");
      modifiedSeedsRanges[index] = {
        start: seedsRange.start + transformation,
        end: seedsRange.end + transformation,
      };
    } else if (
      seedsRange.start >= sourceRange.start &&
      seedsRange.start <= sourceRange.end &&
      seedsRange.end >= sourceRange.end
    ) {
      console.log("modifying range 2");

      modifiedSeedsRanges[index] = {
        start: seedsRange.start + transformation,
        end: sourceRange.end + transformation,
      };
      seedsRanges.push({
        start: sourceRange.end + 1,
        end: seedsRange.end,
      });
    } else if (
      seedsRange.start < sourceRange.start &&
      seedsRange.end >= sourceRange.start &&
      seedsRange.end <= sourceRange.end
    ) {
      console.log("modifying range 3");
      modifiedSeedsRanges[index] = {
        start: seedsRange.start,
        end: sourceRange.start - 1,
      };
      modifiedSeedsRanges.push({
        start: sourceRange.start + transformation,
        end: sourceRange.end + transformation,
      });
    }
  });
}

seedsRanges = modifiedSeedsRanges; // save modified seed
console.log(seedsRanges);
console.log(
  `Day 5 part 2 : new min location = ${Math.min(
    ...seedsRanges.map((range) => range.start)
  )}`
);
*/
