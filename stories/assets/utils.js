/* ---------------------------- Arrays -------------------------------------- */

// this just creates and fills a zero-indexed array array; 0, 1, 2, 3, etc
export const arraySequence = numberOfElements =>
  Array.from(new Array(numberOfElements).keys())

export { arraySequence }
