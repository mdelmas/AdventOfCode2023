import * as fs from "fs";

interface DrawSet {
  red: number;
  green: number;
  blue: number;
}
type DrawSetKey = keyof DrawSet;

const bagContent: DrawSet = { red: 12, green: 13, blue: 14 };

const input = fs.readFileSync("./input", "utf-8").split("\n");

let validGames: number[] = [];
let gamesPowers: number[] = [];

for (const line of input) {
  let [gameNumber, drawLine] = line.split(":");
  let processedGameNumber = +gameNumber.trim().split(" ")[1];

  let gameValidity = true;
  let gameRequirement: DrawSet = { red: 0, green: 0, blue: 0 };

  let draws = drawLine.trim().split(";");
  draws.forEach((draw) => {
    let splitDraw = draw.trim().split(",");

    for (const colorDraw of splitDraw) {
      let [count, color] = colorDraw.trim().split(" ");

      if (+count > bagContent[color as DrawSetKey]) {
        gameValidity = false;
      }

      if (gameRequirement[color as DrawSetKey] < +count) {
        gameRequirement[color as DrawSetKey] = +count;
      }
    }
  });

  if (gameValidity) {
    validGames.push(processedGameNumber);
  }

  gamesPowers.push(
    gameRequirement.red * gameRequirement.green * gameRequirement.blue
  );
}

const sumOfValidGames = validGames.reduce((sum, current) => sum + current, 0);
console.log(`Part 1 : sum of valid games = ${sumOfValidGames}`);

const sumOfPowers = gamesPowers.reduce((sum, current) => sum + current, 0);
console.log(`Part 2 : sum of powers = ${sumOfPowers}`);

// const sumOfValidGames = validGames.reduce((sum, current) => sum + current, 0);
// console.log(`Part 1 : sum of valid games = ${sumOfValidGames}`);

/*  
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
*/
