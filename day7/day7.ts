import * as fs from "fs";

const HAND_LENGTH = 5;

enum Part {
  ONE,
  TWO,
}

// Part 1 cards values : A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, 2
const cardValues: Map<string, number> = new Map([
  ["A", 14],
  ["K", 13],
  ["Q", 12],
  ["J", 11],
  ["T", 10],
]);
// Part 2 cards values : A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2, J
const newCardValues: Map<string, number> = new Map([
  ["A", 13],
  ["K", 12],
  ["Q", 11],
  ["T", 10],
  ["J", 1],
]);

enum HandType {
  FiveKind = 7, // 5 time same card -> 1 type
  FourOfAKind = 6, // 4 time same card + 1 other -> 2 types
  FullHouse = 5, // 3 time same card + 2 same other -> 2 types
  ThreeOfAKind = 4, // 3 time same card + 2 different others -> 3 types
  TwoPair = 3, // 2 time same card + 2 time same other card + 1 other -> 3 types
  OnePair = 2, // 2 time same card + 3 different others -> 4 type
  HighCard = 1, // all different cards -> 5 type
}

class Hand {
  cards: string[];
  bid: number;
  rank: number;

  type: HandType | undefined;
  cardsDistribution: Map<string, number> = new Map();
  cardsDistributionJoker: Map<string, number> = new Map();

  constructor({ cards, bid }: { cards: string[]; bid: number }) {
    this.cards = cards;
    this.bid = bid;
    this.rank = 0;

    this.defineHandType(Part.ONE);
  }

  defineCardsDistribution(part: Part): void {
    this.cardsDistribution = new Map();

    this.cards.forEach((card) => {
      this.cardsDistribution.set(
        card,
        (this.cardsDistribution.get(card) ?? 0) + 1
      );
    });

    if (part === Part.TWO) {
      if (this.cardsDistribution.has("J") && this.cardsDistribution.size > 1) {
        const jokersValue = this.cardsDistribution.get("J")!;

        const [maxKey, maxValue] = [...this.cardsDistribution.entries()]
          .filter(([key, _]) => key !== "J")
          .reduce((max, distribution) => {
            return distribution[1] > max[1] ? distribution : max;
          });

        this.cardsDistribution.set(maxKey, maxValue + jokersValue);
        this.cardsDistribution.delete("J");
      }
    }
  }

  defineHandType(part: Part): void {
    this.defineCardsDistribution(part);

    let cardsDistributionValues = [...this.cardsDistribution.values()].sort();
    switch (this.cardsDistribution.size) {
      case 1:
        this.type = HandType.FiveKind;
        break;
      case 2:
        if (cardsDistributionValues.toString() === [1, 4].toString()) {
          this.type = HandType.FourOfAKind;
        } else if (cardsDistributionValues.toString() === [2, 3].toString()) {
          this.type = HandType.FullHouse;
        }
        break;
      case 3:
        if (cardsDistributionValues.toString() === [1, 1, 3].toString()) {
          this.type = HandType.ThreeOfAKind;
        } else if (
          cardsDistributionValues.toString() === [1, 2, 2].toString()
        ) {
          this.type = HandType.TwoPair;
        }
        break;
      case 4:
        this.type = HandType.OnePair;
        break;
      case 5:
        this.type = HandType.HighCard;
        break;
    }
  }

  compareCards(cardA: string, cardB: string, part: Part): number {
    let usedCardValues = part === Part.ONE ? cardValues : newCardValues;
    const cardAValue = usedCardValues.get(cardA) ?? +cardA;
    const cardBValue = usedCardValues.get(cardB) ?? +cardB;
    return cardAValue - cardBValue;
  }

  compareHand(otherHand: Hand, part: Part): number {
    if (this.type === undefined || otherHand.type === undefined) {
      return this.type || otherHand.type || 0;
    }
    if (this.type !== otherHand.type) {
      return this.type - otherHand.type;
    }

    for (let i = 0; i < HAND_LENGTH; i++) {
      if (this.cards[i] === otherHand.cards[i]) continue;

      return this.compareCards(this.cards[i], otherHand.cards[i], part);
    }

    return 0;
  }
}

const mode = process.argv[2];
const file = mode === "--test" || mode === "-t" ? "test" : "input";
const hands: Hand[] = fs
  .readFileSync(`./${file}`, "utf-8")
  .split("\n")
  .map((line) => {
    const [cards, bid] = line.split(/\s/);
    return new Hand({
      cards: cards.split(""),
      bid: +bid,
    });
  });

hands.sort((handA, handB) => handA.compareHand(handB, Part.ONE));
hands.forEach((hand, i) => (hand.rank = i + 1));

console.log(
  `Day 7 part 1 : total winnings = ${hands.reduce(
    (total, hand) => total + hand.bid * hand.rank,
    0
  )}`
);

hands.forEach((hand, i) => hand.defineHandType(Part.TWO));
hands.sort((handA, handB) => handA.compareHand(handB, Part.TWO));
hands.forEach((hand, i) => {
  hand.rank = i + 1;
});

console.log(
  `Day 7 part 2 : total winnings = ${hands.reduce(
    (total, hand) => total + hand.bid * hand.rank,
    0
  )}`
);
