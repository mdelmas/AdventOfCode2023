import * as fs from "fs";

const HAND_LENGTH = 5;

// A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2
const cardValues: Map<string, number> = new Map([
  ["A", 14],
  ["K", 13],
  ["Q", 12],
  ["J", 11],
  ["T", 10],
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

  constructor({ cards, bid }: { cards: string[]; bid: number }) {
    this.cards = cards;
    this.bid = bid;
    this.rank = 0;

    this.defineHandType();
  }

  defineHandType(): void {
    this.cards.forEach((card) => {
      this.cardsDistribution.set(
        card,
        (this.cardsDistribution.get(card) ?? 0) + 1
      );
    });

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

  compareHand(otherHand: Hand): number {
    if (this.type === undefined || otherHand.type === undefined) {
      return this.type || otherHand.type || 0;
    }
    if (this.type !== otherHand.type) {
      return this.type - otherHand.type;
    }

    for (let i = 0; i < HAND_LENGTH; i++) {
      if (this.cards[i] === otherHand.cards[i]) continue;

      const cardAValue = cardValues.get(this.cards[i]) ?? +this.cards[i];
      const cardBValue =
        cardValues.get(otherHand.cards[i]) ?? +otherHand.cards[i];
      return cardAValue - cardBValue;
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

hands.sort((handA, handB) => handA.compareHand(handB));
hands.forEach((hand, i) => {
  hand.rank = i + 1;
});

console.log(
  `Day 7 part 1 : total winnings = ${hands.reduce(
    (total, hand) => total + hand.bid * hand.rank,
    0
  )}`
);
