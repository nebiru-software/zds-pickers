// this just creates and fills a zero-indexed array array; 0, 1, 2, 3, etc
export const arraySequence = numberOfElements =>
  Array(...{ length: numberOfElements }).map(Function.call, Number)
