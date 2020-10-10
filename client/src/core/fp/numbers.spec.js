import 'jest-localstorage-mock'

import {
  assertRange,
  assertWrappedRange,
  fallsBetween,
  fallsWithin,
  sum,
} from './numbers'

beforeEach(jest.clearAllMocks)
afterEach(() => { process.env.NODE_ENV = 'test' })

describe('numbers tests', () => {
  it('fallsBetween', () => {
    expect(fallsBetween(4, 2, 6)).toEqual(true)
    expect(fallsBetween(2, 2, 6)).toEqual(false)
    expect(fallsBetween(6, 2, 6)).toEqual(false)
  })

  it('fallsWithin', () => {
    expect(fallsWithin(4, 2, 6)).toEqual(true)
    expect(fallsWithin(2, 2, 6)).toEqual(true)
    expect(fallsWithin(6, 2, 6)).toEqual(true)
  })

  it('assertRange', () => {
    expect(assertRange(5, 0, 10)).toBe(5)
    expect(assertRange(15, 0, 10)).toBe(10)
    expect(assertRange(-5, 0, 10)).toBe(0)
    expect(assertRange(0, 0, 10)).toBe(0)
    expect(assertRange(10, 0, 10)).toBe(10)
  })

  it('assertWrappedRange', () => {
    expect(assertWrappedRange(5, 0, 10)).toBe(5)
    expect(assertWrappedRange(15, 0, 10)).toBe(0)
    expect(assertWrappedRange(-5, 0, 10)).toBe(10)
    expect(assertWrappedRange(0, 0, 10)).toBe(0)
    expect(assertWrappedRange(10, 0, 10)).toBe(10)
  })

  it('sum', () => {
    expect(sum(1)).toEqual(1)
    expect(sum(1, 2, 3, 4)).toEqual(10)
    expect(sum('a')).toEqual('a')
    expect(sum('a', 'b', 'c')).toEqual('abc')
    expect(sum(1, 'b', 3, 'd')).toEqual('1b3d')
  })
})
