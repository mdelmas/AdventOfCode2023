import * as fs from "fs";

enum Direction {
  UP = "U",
  RIGHT = "R",
  DOWN = "D",
  LEFT = "L",
}

class Point {
  constructor(public x: number, public y: number) {}
}

class Segment {
  constructor(
    public direction: Direction,
    public steps: number,
    public color: string
  ) {}
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
const segments = fs
  .readFileSync(`./${file}`, "utf-8")
  .trim()
  .split("\n")
  .map((line) => {
    let [direction, steps, color] = line.split(" ");
    color = color.replace("(", "").replace(")", "");
    return new Segment(direction as Direction, +steps, color);
  });

let shape = new Shape(segments);
console.log(`Day 18 part 1 : area = ${shape.calculateArea()}`);
