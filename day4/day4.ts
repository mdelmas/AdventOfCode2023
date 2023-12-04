import * as fs from "fs";

interface Card {
  number: number;
  winningNumbers: number[];
  presentNumbers: number[];
  points: number;
  copies: number;
}
let cards: Card[] = [];

fs.readFileSync("./input", "utf-8")
  .split("\n")
  .forEach((line) => {
    const number = +line.match(/Card\s*([0-9]+):/)![1]; // find card number

    // find winning numbers, between ':' and '|'
    const winningNumbers = [
      ...line.match(/:.*\|/)![0].matchAll(/\s?([0-9]{2}|\s[0-9])\s?/g),
    ].map((match) => +match[1]);

    // find present numbers, between '|' and end of line
    const presentNumbers = [
      ...line.match(/\|.*/)![0].matchAll(/\s?([0-9]{2}|\s[0-9])\s?/g),
    ].map((match) => +match[1]);

    cards.push({
      number,
      winningNumbers,
      presentNumbers,
      points: 0,
      copies: 1,
    });
  });

// PROCESSING
cards.forEach((card) => {
  let numberOfWinningCards = 0; // count winning cards for PART 2

  card.presentNumbers.forEach((number) => {
    if (card.winningNumbers.includes(number)) {
      card.points = card.points > 0 ? card.points * 2 : 1; // count points for PART 1
      numberOfWinningCards++;
    }
  });

  // count copies for PART 2
  for (let i = 0; i < numberOfWinningCards; i++) {
    cards[card.number + i].copies += card.copies;
  }
});

// PART 1
let sumOfPoints = cards.reduce((sum, card) => sum + card.points, 0);
console.log(`Day 4 part 1 : sum of points = ${sumOfPoints}`);

// PART 2
let sumOfCardsCopies = cards.reduce((sum, card) => sum + card.copies, 0);
console.log(`Day 4 part 2 : sum of cards copies = ${sumOfCardsCopies}`);
