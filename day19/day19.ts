import { exec } from "child_process";
import * as fs from "fs";
import { property } from "lodash";

type Step = {
  labelCondition?: string;
  condition?: (part: Part) => boolean;
  outcome: string;
};

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
  accepted: boolean;
};
type PartProperty = "x" | "m" | "a" | "s";

const mode = process.argv[2];
const file = mode === "-t" || mode === "--test" ? "test" : "input";
const [rawWorkflows, rawParts] = fs
  .readFileSync(`./${file}`, "utf-8")
  .trim()
  .split("\n\n")
  .map((input) => input.split("\n"));

const getConditionFunction = (step: string) => {
  let [property, value] = step.split(/<|>/);

  if (step.includes("<")) {
    return (part: Part) => part[property as PartProperty] < +value;
  }
  return (part: Part) => part[property as PartProperty] > +value;
};

const workflows: Map<string, Step[]> = new Map(
  rawWorkflows.map((workflow) => {
    let label = workflow.split("{")[0];
    let steps = workflow
      .split("{")[1]
      .replace("}", "")
      .split(",")
      .map((rawStep) => rawStep.split(":"))
      .map((step) => {
        if (step.length === 2) {
          return {
            labelCondition: step[0],
            condition: getConditionFunction(step[0]),
            outcome: step[1],
          };
        }
        return { outcome: step[0] };
      });

    return [label, steps];
  })
);

const parts = rawParts.map((rawPart) => {
  let properties: string[][] = rawPart
    .replace("{", "")
    .replace("}", "")
    .split(",")
    .map((property) => property.split("="));

  let part: Part = { x: 0, m: 0, a: 0, s: 0, accepted: false };
  properties.forEach(
    ([property, value]) => (part[property as PartProperty] = +value)
  );
  return part;
});

parts.forEach((part) => {
  let rule = workflows.get("in");

  if (!rule) {
    return;
  }

  while (rule) {
    for (let step of rule) {
      if (!step.condition) {
        if (step.outcome === "A" || step.outcome === "R") {
          if (step.outcome === "A") {
            part.accepted = true;
          }

          rule = undefined;
          break;
        }

        rule = workflows.get(step.outcome);
        break;
      }

      if (step.condition(part)) {
        if (step.outcome === "A" || step.outcome === "R") {
          if (step.outcome === "A") {
            part.accepted = true;
          }

          rule = undefined;
          break;
        }

        rule = workflows.get(step.outcome);
        break;
      }
    }
  }
});

console.log(
  `Day 19 part1: sum of properties of accepted parts = ${parts
    .filter((part) => part.accepted)
    .reduce((sum, part) => sum + part.a + part.m + part.s + part.x, 0)}`
);
