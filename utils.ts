export const processNumbersSequence: (s: string) => number[] = (s: string) =>
  s
    .trim()
    .split(/\s+/)
    .map((time) => +time);
