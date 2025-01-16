// this just creates and fills a zero-indexed array array; 0, 1, 2, 3, etc
const arraySequence = (numberOfElements: number) =>
  Array.from(new Array(numberOfElements).keys())

const assertRange = (value: number | string, max = 127, min = 0) => {
  let result: number =
    typeof value === 'string' ? Number.parseInt(value, 10) : value

  if (Number.isNaN(result) || result === null) {
    result = min
  }
  return result >= min ? (result <= max ? result : max) : min
}

const findObj =
  <T>(key: keyof T, value: T[keyof T]) =>
  (arr: T[]) =>
    arr?.find(item => item?.[key] === value)

const omit =
  <T extends Record<string, unknown>>(...keys: string[]) =>
  (obj: T) =>
    Object.entries(obj)
      .filter(([key]) => !keys.flat().map(String).includes(key))
      .reduce((_obj, [key, val]) => Object.assign(_obj, { [key]: val }), {})

const pick =
  <T extends object>(...keys: (keyof T)[]) =>
  (obj: T) =>
    Object.entries(obj)
      .filter(([key]) => keys.flat().map(String).includes(key))
      .reduce((_obj, [key, val]) => Object.assign(_obj, { [key]: val }), {})

const set =
  <T>(key: keyof T, value: T[keyof T]) =>
  (obj: T) => ({
    ...obj,
    [key]: value,
  })

export { arraySequence, assertRange, findObj, omit, pick, set }
