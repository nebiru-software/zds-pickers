import { assertRange } from './index'

describe('index tests', () => {
  it('assertRange should work', () => {
    expect(assertRange(10, 20, 0)).toEqual(10)
    expect(assertRange(30, 20, 0)).toEqual(20)
    expect(assertRange(2, 20, 10)).toEqual(10)
    expect(assertRange('10', 20, 0)).toEqual(10)
    expect(assertRange('30', 20, 0)).toEqual(20)
    expect(assertRange('2', 20, 10)).toEqual(10)
    expect(assertRange(null)).toEqual(0)
    expect(assertRange(null, 10, 5)).toEqual(5)
    expect(assertRange(undefined)).toEqual(0)
    expect(assertRange(undefined, 10, 5)).toEqual(5)
    expect(assertRange(512)).toEqual(127)
    expect(assertRange(-10)).toEqual(0)
    expect(assertRange(10)).toEqual(10)
  })
})
