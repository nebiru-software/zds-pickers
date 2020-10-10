/* eslint-disable no-use-before-define */

import { Maybe } from 'monet'
import hash from 'object-hash'
import { identity } from './utils'
import { pick } from './objects'

export const arraySequence = numberOfElements => Array.from(Array(numberOfElements).keys())

export const chunk = size => arr => arr.reduce(
  (_arr, item, idx) => idx % size === 0 //
    ? [..._arr, [item]]
    : [..._arr.slice(0, -1), [..._arr.slice(-1)[0], item]],
  [],
)

/**
 * dedupe() is slightly faster than dedupeById()
 * only use the latter for arrays of objects
 */
export const dedupe = arr => [...new Set(arr)]

export const dedupeById = (arr, id = 'id') => [...new Set(arr.map(a => a[id]))]
  .map(i => arr.find(a => a[id] === i))

export const dedupeByKeys = (arr, keys) => {
  const result = new Map()
  arr.forEach((item) => {
    result.set(hash(pick(keys)(item)), item)
  })
  return Array.from(result.values())
}

export const difference = (arr1 = []) => (arr2 = []) => arr1?.filter(x => !arr2?.includes(x))

export const filter = f => arr => arr?.filter(f || identity)

export const find = f => arr => arr?.find(f || identity)

export const findObj = (key, value) => arr => arr?.find(item => item?.[key] === value)

export const first = arr => arr?.[0]

export { flatten } from './utils'

/**
 * Can also use this on objects.
 * Use with curryRight to chain.
 */
export const getAt = (arr, idx) => arr?.[idx]

export const intersection = (arr1 = []) => (arr2 = []) => arr1?.filter(x => arr2?.includes(x))

export const isEmpty = obj => !obj || ([Object, Array].includes(obj.constructor) && !Object.entries(obj).length)

export const last = arr => arr?.slice(-1)[0]

export const map = fn => arr => arr?.map(fn)

export const orderBy = arr => key => arr.concat().sort(sortBy(key))

export const reduce = (r, init) => arr => (arr && r) ? arr.reduce(r, init) : init

export const reverse = arr => arr.slice().reverse()

export const sample = (arr, n = 1) => Maybe.fromUndefined(arr)
  .map(shuffle)
  .map(items => items.slice(0, n))
  .orSome([])

/* istanbul ignore next */
export const shuffle = arr => arr.sort(() => (0.5 - Math.random()))

export const sortBy = (key, dir = 'ASC') => (a, b) => {
  const result = (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0)
  return dir === 'ASC' ? result : 0 - result
}

export const splitAt = index => A => [A.slice(0, index), A.slice(index)]

export const toKeyedObject = (arr, id = 'id') => (
  (arr || [])
    .filter(x => Object.prototype.hasOwnProperty.call(x, id))
    .reduce((acc, item) => ({ ...acc, [item[id]]: item }), {})
)

export const toggleItem = arr => item => arr.includes(item)
  ? arr.filter(key => key !== item)
  : [...arr, item]

export const xDifference = (arr1 = []) => (arr2 = []) => arr1
  ?.filter(x => !arr2?.includes(x))
  .concat(arr2?.filter(x => !arr1?.includes(x)))
