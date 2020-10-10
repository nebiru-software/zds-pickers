/* eslint-disable no-console */
import { compose } from 'redux'
import { Either } from 'monet'
import { random } from 'faker'
import {
  binary,
  callWith,
  curry,
  curryRight,
  debounce,
  delay,
  distill,
  eitherToPromise,
  equals,
  flatten,
  identity,
  isDefined,
  isFunction,
  matches,
  matchesOneOf,
  not,
  pipe,
  promiseToEither,
  tap,
  throttle,
  unary,
  unless,
  when,
  whenPresent,
} from './utils'
import { arraySequence } from './arrays'

describe('util tests', () => {
  it('identity', () => {
    const items = [
      //
      'dog',
      42,
      false,
      new Date(),
      new Error('oops'),
      { key: 'value' },
      null,
      undefined,
      Math.NaN,
    ]
    items.forEach(value => expect(identity(value)).toEqual(value))
  })

  it('equals', () => {
    expect(equals(1)(1)).toBeTrue()
    expect(equals('1')(1)).toBeFalse()
    expect(equals()(1)).toBeFalse()
    expect(equals(1)()).toBeFalse()
    expect(equals(null)(null)).toBeTrue()
    expect(equals(undefined)(undefined)).toBeTrue()
    expect(equals(null)(undefined)).toBeFalse()
    expect(equals()(undefined)).toBeTrue()
  })

  it('isDefined', () => {
    expect(isDefined('dog')).toBe(true)
    expect(isDefined(null)).toBe(false)
    expect(isDefined(undefined)).toBe(false)
    expect(isDefined(Math.NaN)).toBe(false)
    expect(isDefined(27)).toBe(true)
  })

  it('isFunction', () => {
    function oldSchool() {}
    const es2015 = () => {}
    expect(isFunction(f => f)).toBe(true)
    expect(isFunction(oldSchool)).toBe(true)
    expect(isFunction(es2015)).toBe(true)
    expect(isFunction('function')).toBe(false)
    expect(isFunction('Function')).toBe(false)
  })

  it('not', () => {
    expect(not(false)).toBeTrue()
    expect(not(0)).toBeTrue()
    expect(not(null)).toBeTrue()
    expect(not(undefined)).toBeTrue()

    expect(not(true)).toBeFalse()
    expect(not(1)).toBeFalse()
    expect(not('dog')).toBeFalse()
    expect(not(new Date())).toBeFalse()
    expect(not({})).toBeFalse()
    expect(not(f => f)).toBeFalse()
  })

  it('matches', () => {
    const obj = {
      f1: 'cat',
      f2: 123,
    }
    expect(matches('f1', 'cat')(obj)).toBeTrue()
    expect(matches('f1', 'dog')(obj)).toBeFalse()
    expect(matches('f1', 123)(obj)).toBeFalse()
    expect(matches('f1', null)(obj)).toBeFalse()
    expect(matches('f1', undefined)(obj)).toBeFalse()
    expect(matches('f2', 123)(obj)).toBeTrue()
    expect(matches('f2', 456)(obj)).toBeFalse()
    expect(matches('f2', 'cat')(obj)).toBeFalse()
    expect(matches('f2', null)(obj)).toBeFalse()
    expect(matches('f2', undefined)(obj)).toBeFalse()
    expect(matches()(obj)).toBeTrue()
    expect(matches(undefined, undefined)(obj)).toBeTrue()
    expect(matches(undefined, null)(obj)).toBeFalse()
    expect(matches(null, undefined)(obj)).toBeTrue()
    expect(matches('f4', undefined)(obj)).toBeTrue()
  })

  it('matchesOneOf', () => {
    const obj = {
      f1: 'cat',
      f2: 123,
      f3: 'dog',
    }
    expect(matchesOneOf('f1', ['cat'])(obj)).toBeTrue()
    expect(matchesOneOf('f1', ['dog'])(obj)).toBeFalse()
    expect(matchesOneOf('f1', [123])(obj)).toBeFalse()
    expect(matchesOneOf('f1', [123, 'cat'])(obj)).toBeTrue()
    expect(matchesOneOf('f1', null)(obj)).toBeFalse()
    expect(matchesOneOf('f1', undefined)(obj)).toBeFalse()
    expect(matchesOneOf('f2', [123])(obj)).toBeTrue()
    expect(matchesOneOf('f2', [456])(obj)).toBeFalse()
    expect(matchesOneOf('f2', [123, 456])(obj)).toBeTrue()
    expect(matchesOneOf('f2', ['cat'])(obj)).toBeFalse()
    expect(matchesOneOf('f2', null)(obj)).toBeFalse()
    expect(matchesOneOf('f2', undefined)(obj)).toBeFalse()
    expect(matchesOneOf()(obj)).toBeFalse()
    expect(matchesOneOf(undefined, undefined)(obj)).toBeFalse()
    expect(matchesOneOf(undefined, null)(obj)).toBeFalse()
    expect(matchesOneOf(null, undefined)(obj)).toBeFalse()
    expect(matchesOneOf('f4', undefined)(obj)).toBeFalse()
  })

  it('tap', () => {
    console.log = jest.fn()
    const data = 'data'
    const desc = 'desc'

    tap(desc)(data)
    expect(console.log).toHaveBeenCalledWith('desc> "data"')

    tap()(data)
    expect(console.log).toHaveBeenCalledWith('TAP> "data"')
  })

  it('promiseToEither', async () => {
    let monad = await promiseToEither(Promise.resolve())
    expect(monad.isRight()).toBe(true)

    monad = await promiseToEither(Promise.reject())
    expect(monad.isLeft()).toBe(true)
  })

  it('eitherToPromise', async () => {
    const result = await eitherToPromise(Either.Right('success'))
    expect(result).toBe('success')

    try {
      await eitherToPromise(Either.Left('error'))
    } catch (e) {
      expect(e).toBe('error')
    }
  })

  it('unless', () => {
    const callback = jest.fn()
    unless(true, callback)
    expect(callback).not.toHaveBeenCalled()
    unless(false, callback)
    expect(callback).toHaveBeenCalled()
    unless(false, callback, 123)
    expect(callback).toHaveBeenCalledWith(123)
  })

  it('when', () => {
    const callback = jest.fn()
    when(false, callback)
    expect(callback).not.toHaveBeenCalled()
    when(true, callback)
    expect(callback).toHaveBeenCalled()
    when(true, callback, 123)
    expect(callback).toHaveBeenCalledWith(123)
  })

  it('whenPresent', () => {
    const callback = jest.fn()
    whenPresent(callback)
    expect(callback).toHaveBeenCalled()
    jest.clearAllMocks()
    whenPresent(null)
    expect(callback).not.toHaveBeenCalled()
    whenPresent(callback, 123)
    expect(callback).toHaveBeenCalledWith(123)
  })

  it('distill', () => {
    const data = random.words(3)
    const fn = () => data
    expect(distill(fn)).toEqual(data)
    expect(distill(data)).toEqual(data)
    expect(distill()).toBeUndefined()
    expect(distill(undefined)).toBeUndefined()
    expect(distill(null)).toBeNull()
  })

  it('callWith', () => {
    const fn = x => x * 10
    expect(callWith(4)(fn)).toBe(40)
    expect(callWith(undefined)(fn)).toBeNaN()
  })

  it('unary', () => {
    const baseFn = jest.fn((a, b) => a + b)
    unary(baseFn)('a', 'b')
    expect(baseFn).toHaveBeenCalledWith('a')
  })

  it('binary', () => {
    const baseFn = jest.fn((a, b, c) => a + b + c)
    binary(baseFn)('a', 'b')
    expect(baseFn).toHaveBeenCalledWith('a', 'b')
  })

  it('curry', () => {
    const baseFn = jest.fn((a, b, c) => a + b + c)
    const curried = curry(baseFn)
    expect(curried(1)(2)(3)).toBe(6)
    expect(typeof curried(1)(2)).toBe('function')
  })
  it('curryRight', () => {
    const baseFn = jest.fn((a, b, c) => a + b + c)
    const curried = curryRight(baseFn, 3)
    expect(curried(1, 2)).toBe(6)
    expect(typeof curried).toBe('function')
    expect(typeof curried(1)).toBe('number')
  })

  it('pipe', () => {
    const fns = [
      //
      x => x * 3,
      x => x + 3,
      x => x - 1,
    ]

    expect(pipe(...fns)(2)).toEqual(8)
    expect(compose(...fns)(2)).toEqual(12)
  })

  it('debounce', () => {
    const baseFn = jest.fn()
    const debounced = debounce(1000, baseFn)

    arraySequence(10).forEach(debounced)

    expect(baseFn).toBeCalledTimes(0)
    jest.runAllTimers()
    expect(baseFn).toBeCalledTimes(1)
  })

  it('throttle', () => {
    const baseFn = jest.fn()
    const throttled = throttle(1000, baseFn)

    arraySequence(10).forEach(throttled)

    expect(baseFn).toBeCalledTimes(1)
    jest.runAllTimers()
    expect(baseFn).toBeCalledTimes(1)
  })

  it('delay', async () => {
    jest.useRealTimers()

    const msTimeout = 500
    const t0 = performance.now()
    await delay(msTimeout)
    const t1 = performance.now()

    expect(Math.abs(msTimeout - (t1 - t0))).toBeLessThan(100)
  })

  it('flatten', () => {
    expect(flatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, [3, [4]], 5])
  })
})
