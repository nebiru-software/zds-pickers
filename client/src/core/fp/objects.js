/* eslint-disable no-use-before-define */

import produce from 'immer'
import { compose } from 'redux'
import { flatten, isDefined } from './utils'

export const deepMerge = (target, source) => {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = deepMerge(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

export const deepSortObject = obj => isObject(obj)
  ? Object.keys(sortObject(obj)).reduce((acc, key) => ({ ...acc, [key]: deepSortObject(obj[key]) }), {})
  : Array.isArray(obj)
    ? obj.map(deepSortObject)
    : obj

export const dependantFieldsHash = fieldNames => obj => fieldNames.reduce(
  (acc, field) => acc + String(obj[field]),
  '',
)

export const filterKeyedObject = (obj, f) => {
  const keptKeys = Object.keys(obj).filter(key => f(obj[key]))
  return keptKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: { ...obj[key] },
    }),
    {},
  )
}

export const get = (path, literal = false) => obj => literal
  ? obj[path]
  : path?.split('.').reduce(
    (acc, frag) => isDefined(acc)
      ? acc[frag]
      : undefined,
    obj,
  )

export const hasProperty = key => compose(isDefined, get(key))

export const isEqual = a => (b) => {
  if (a === b) return true
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b
  if (a === null || a === undefined || b === null || b === undefined) return false
  if (a.prototype !== b.prototype) return false
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every(k => isEqual(a[k])(b[k]))
}

export const isObject = value => value === Object(value)
  && [
    '[object Array]',
    '[object Date]',
    '[object Function]',
  ].indexOf(Object.prototype.toString.call(value)) === -1

export const mapKeys = fn => obj => Object.entries(obj).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [fn(key, value, obj)]: value,
  }),
  {},
)

export const mapValues = fn => obj => Object.entries(obj).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: fn(value, key, obj),
  }),
  {},
)

export const merge = target => source => ({ ...source, ...target })

export const omit = (...keys) => obj => Object.entries(obj)
  .filter(([key]) => !flatten([...keys])
    .map(String)
    .includes(key))
  .reduce((_obj, [key, val]) => Object.assign(_obj, { [key]: val }), {})

export const pick = (...keys) => obj => Object.entries(obj)
  .filter(([key]) => flatten([...keys])
    .map(String)
    .includes(key))
  .reduce((_obj, [key, val]) => Object.assign(_obj, { [key]: val }), {})

export const renameKeys = (keysMap, obj) => Object
  .keys(obj)
  .reduce((acc, key) => ({
    ...acc,
    ...{ [keysMap[key] || key]: obj[key] },
  }), {})

export const set = (path, value, literal = false) => obj => produce(obj, (draft) => {
  const pList = literal ? [path] : String(path).split('.')
  const key = pList.pop()
  const pointer = pList.reduce((acc, val) => {
    if (acc[val] === undefined) {
      // eslint-disable-next-line no-param-reassign
      acc[val] = {}
    }
    return acc[val]
  }, draft)
  pointer[key] = value

  return draft
})

export const sortObject = obj => Object.fromEntries(Object.entries(obj).sort())
