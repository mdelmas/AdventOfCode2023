import * as fs from "fs";
import { processNumbersSequence } from "../utils";

const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const input = fs.readFileSync(`./${file}`, "utf-8").split("\n");

interface Race {
  time: number;
  distanceRecord: number;
  possibilitiesToWin: number;
}

const getPossibilitiesToWin = (race: Race) => {
  for (let speed = 0; speed <= race.time / 2; speed++) {
    // speed = time hold

    const timeLeft = race.time - speed;
    const distance = speed * timeLeft;

    if (distance > race.distanceRecord) {
      race.possibilitiesToWin += 2;
    }
  }
};

// PART 1
const races: Race[] = [];

const times = processNumbersSequence(input[0].split(":")[1]);
const distanceRecords = processNumbersSequence(input[1].split(":")[1]);

times.forEach((_, i) => {
  races.push({
    time: times[i],
    distanceRecord: distanceRecords[i],
    possibilitiesToWin: 0,
  });
});

races.forEach(getPossibilitiesToWin);
console.log(
  `Day 6 part 1 : ${races.reduce(
    (total, race) => total * race.possibilitiesToWin,
    1
  )}`
);

// PART 2
const time = +input[0].split(":")[1].replaceAll(" ", "");
const distanceRecord = +input[1].split(":")[1].replaceAll(" ", "");

const race: Race = { time, distanceRecord, possibilitiesToWin: 0 };
getPossibilitiesToWin(race);
console.log(`Day 6 part 2 : ${race.possibilitiesToWin}`);
