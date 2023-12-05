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

let seedsRanges: Range[] = [];
seeds.forEach((_, index) => {
  if (index % 2 !== 0) return;

  const [startRange, rangeLength] = seeds.slice(index);
  seedsRanges.push({
    start: startRange,
    end: startRange + rangeLength - 1,
  });
});
let modifiedSeedsRanges: Range[] = []; // copy of seeds to modify a seed only once (only basing myself on the initial value of seed)

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

    seedsRanges = modifiedSeedsRanges.concat(
      seedsRanges.filter((range) => range.start !== -1)
    ); // save modified seed
    modifiedSeedsRanges = [];

    continue;
  }

  // else process the mapping
  // line: destination range start, source range start, range length
  const [startDestinationRange, startSourceRange, rangeLength] = line
    .split(/\s+/)
    .map((n) => +n);

  const transformation = startDestinationRange - startSourceRange;
  const sourceRange = {
    start: startSourceRange,
    end: startSourceRange + rangeLength - 1,
  };

  seedsRanges.forEach((seedsRange, index) => {
    if (seedsRanges[index].start === -1) return;

    if (
      seedsRange.start >= sourceRange.start &&
      seedsRange.end <= sourceRange.end
    ) {
      modifiedSeedsRanges.push({
        start: seedsRange.start + transformation,
        end: seedsRange.end + transformation,
      });
      seedsRanges[index] = {
        start: -1,
        end: -1,
      };
    } else if (
      seedsRange.start >= sourceRange.start &&
      seedsRange.start <= sourceRange.end &&
      seedsRange.end >= sourceRange.end
    ) {
      modifiedSeedsRanges.push({
        start: seedsRange.start + transformation,
        end: sourceRange.end + transformation,
      });
      seedsRanges[index] = {
        start: sourceRange.end + 1,
        end: seedsRange.end,
      };
    } else if (
      seedsRange.start < sourceRange.start &&
      seedsRange.end >= sourceRange.start &&
      seedsRange.end <= sourceRange.end
    ) {
      seedsRanges[index] = {
        start: seedsRange.start,
        end: sourceRange.start - 1,
      };
      modifiedSeedsRanges.push({
        start: sourceRange.start + transformation,
        end: seedsRange.end + transformation,
      });
    }
  });
}

seedsRanges = modifiedSeedsRanges.concat(
  seedsRanges.filter((range) => range.start !== -1)
); // save modified seed
console.log(
  `Day 5 part 2 : new min location = ${Math.min(
    ...seedsRanges.map((range) => range.start)
  )}`
);

/*
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
rangeSeeds = modifiedRangeSeeds; // save modified seed
console.log(`Day 5 part 2 : new min location = ${Math.min(...rangeSeeds)}`);
*/
