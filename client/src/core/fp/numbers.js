export const assertRange = (value, min, max) => Math.min(Math.max(value, min), max) || min
export const assertWrappedRange = (value, min, max) => value < min ? max : value > max ? min : value

export const fallsBetween = (value, start, end) => start < value && value < end
export const fallsWithin = (value, start, end) => start <= value && value <= end

export const sum = (...args) => args.reduce((acc, v) => acc + v)
