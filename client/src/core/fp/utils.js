/* eslint-disable no-use-before-define */

import { Either } from 'monet'

export const binary = fn => (a, b) => fn(a, b)

export const callWith = (...args) => fn => fn(...args)

export const curry = fn => function curriedFn(...args) {
  if (args.length < fn.length) {
    return (...rest) => curriedFn(...args.concat([].slice.call(rest)))
  }

  return fn(...args)
}

export const curryRight = (fn, ...partials) => (...args) => fn(...args, ...partials)

export const debounce = (wait, callback) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(this, args), wait)
  }
}

export const delay = async (ms) => {
  const timeout = msec => new Promise(res => setTimeout(res, msec))
  await timeout(ms)
}

export const distill = fn => isFunction(fn) ? fn() : fn

export const eitherToPromise = either => new Promise((resolve, reject) => either.cata(reject, resolve))

export const equals = i => j => i === j

// Placed here to avoid circular dependencies between arrays and objects
export const flatten = arr => arr.reduce((a, b) => a.concat(b), [])

export const identity = f => f

export const isDefined = item => item !== undefined && item !== null && item !== Math.NaN

export const isFunction = f => f instanceof Function

export const matches = (fieldName, value) => (obj = {}) => obj[fieldName] === value

export const matchesOneOf = (fieldName, values) => obj => Array.isArray(values)
  ? values.includes(obj[fieldName])
  : false

export const not = value => !value

export const once = (fn) => {
  let hasRun = false
  let result
  return () => {
    if (hasRun === false) {
      result = fn()
      hasRun = true
    }
    return result
  }
}

const pipeTwo = (fn1, fn2) => (...args) => fn2(fn1(...args))
export const pipe = (...fns) => fns.reduce(pipeTwo)

export const promiseToEither = async promise => promise //
  .then(Either.Right)
  .catch(Either.Left)

export const tap = (desc = 'TAP') => (data) => {
  console.log(`${desc}> ${JSON.stringify(data, null, 2)}`) // eslint-disable-line
  return data
}

export const takeX = idx => (...args) => args?.[idx]

export const takeSecond = takeX(1)

export const takeThird = takeX(2)

export const throttle = (wait, callback) => {
  let waiting = false
  return (...args) => {
    if (!waiting) {
      waiting = true
      callback.apply(this, args)
      setTimeout(() => { waiting = false }, wait)
    }
  }
}

export const toggleBetween = (value, option1, option2) => value === option1 ? option2 : option1

export const unary = fn => arg => fn(arg)

export const unless = (predicate, fn, ...args) => {
  if (!predicate) fn(...args)
}

export const when = (predicate, fn, ...args) => predicate ? fn(...args) : undefined

export const whenPresent = (fn, ...args) => when(fn, fn, ...args)
