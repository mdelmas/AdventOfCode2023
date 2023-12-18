import * as fs from "fs";

enum Direction {
  UP = "U",
  RIGHT = "R",
  DOWN = "D",
  LEFT = "L",
}
const directionsMapping: Map<string, string> = new Map([
  ["0", "R"],
  ["1", "D"],
  ["2", "L"],
  ["3", "U"],
]);
class Point {
  constructor(public x: number, public y: number) {}
}

class Segment {
  constructor(public direction: Direction, public steps: number) {}
}

class Shape {
  points: Point[] = [];
  perimeter: number = 0;

  constructor(segments: Segment[]) {
    this.buildShape(segments);
  }

  buildShape(segments: Segment[]) {
    this.points.push(new Point(0, 0));

    let previousPoint = this.points[this.points.length - 1];
    for (let segment of segments.slice(0, -1)) {
      const newPoint = new Point(previousPoint.x, previousPoint.y);

      switch (segment.direction) {
        case Direction.UP:
          newPoint.y -= segment.steps;
          break;
        case Direction.RIGHT:
          newPoint.x += segment.steps;
          break;
        case Direction.DOWN:
          newPoint.y += segment.steps;
          break;
        case Direction.LEFT:
          newPoint.x -= segment.steps;
          break;
      }
      this.points.push(newPoint);
      previousPoint = newPoint;

      this.perimeter += segment.steps;
    }
    this.perimeter += segments[segments.length - 1].steps;
  }

  // shoelace algorithm
  calculateArea() {
    let area = 0;
    for (let i = 0; i < this.points.length - 1; i++) {
      area += this.points[i].x * this.points[i + 1].y;
      area -= this.points[i + 1].x * this.points[i].y;
    }
    return area / 2 + this.perimeter / 2 + 1; // 1 to account for 4 corners since it's a closed shape
  }
}

const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const input = fs.readFileSync(`./${file}`, "utf-8").trim().split("\n");

// PART 1
const segments = input.map((line) => {
  let [direction, steps] = line.split(" ");
  return new Segment(direction as Direction, +steps);
});

let shape = new Shape(segments);
console.log(`Day 18 part 1 : area = ${shape.calculateArea()}`);

// PART 2
const segmentsP2 = input.map((line) => {
  let [, , color] = line.split(" ");
  color = color.replace("(", "").replace(")", "").replace("#", "");

  let steps = parseInt(color.slice(0, -1), 16);
  let direction = directionsMapping.get(color.slice(-1))! as Direction;

  return new Segment(direction, steps);
});
let shapeP2 = new Shape(segmentsP2);
console.log(`Day 18 part 2 : area = ${shapeP2.calculateArea()}`);
