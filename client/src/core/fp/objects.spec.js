import deepFreeze from 'deep-freeze'
import assessmentReport from '@reducers/assessmentReport'
import {
  deepMerge,
  deepSortObject,
  dependantFieldsHash,
  filterKeyedObject,
  get,
  hasProperty,
  isObject,
  mapKeys,
  mapValues,
  omit,
  pick,
  set,
  sortObject,
} from './objects'
import { pipe } from './utils'

describe('object tests', () => {
  it('isObject', () => {
    expect(isObject({})).toBeTrue()
    expect(isObject(42)).toBeFalse()
    expect(isObject(true)).toBeFalse()
    expect(isObject(new Date())).toBeFalse()
    expect(isObject('string')).toBeFalse()
    expect(isObject([])).toBeFalse()
    expect(isObject(null)).toBeFalse()
    expect(isObject(undefined)).toBeFalse()
    expect(isObject(f => f)).toBeFalse()
  })

  it('omit', () => {
    const obj = { a: 1, b: 2, c: 3, 4: 'd' }
    expect(omit(['a', 'c'])(obj)).toEqual({ b: 2, 4: 'd' })
    expect(omit()(obj)).toEqual(obj)
    expect(omit([4])(obj)).toEqual({ a: 1, b: 2, c: 3 })
    expect(omit('a')(obj)).toEqual({ b: 2, c: 3, 4: 'd' })
    expect(omit('a', 'c')(obj)).toEqual({ b: 2, 4: 'd' })
  })

  it('pick', () => {
    const obj = { a: 1, b: 2, c: 3, 4: 'd' }
    expect(pick(['a', 'c'])(obj)).toEqual({ a: 1, c: 3 })
    expect(pick()(obj)).toEqual({})
    expect(pick([4, 'b'])(obj)).toEqual({ b: 2, 4: 'd' })
    expect(pick('c')(obj)).toEqual({ c: 3 })
    expect(pick('a', 'c')(obj)).toEqual({ a: 1, c: 3 })
  })

  it('filterKeyedObject', () => {
    const obj = {
      7: { name: 'seven' },
      11: { name: 'eleven' },
    }

    let result = filterKeyedObject(obj, entry => entry.name === 'eleven')
    expect(result).toEqual({ 11: { name: 'eleven' } })

    result = filterKeyedObject(obj, entry => entry.name === 'eight')
    expect(result).toEqual({})

    result = filterKeyedObject(obj, entry => entry.name.includes('even'))
    expect(result).toEqual(obj)
  })

  it('sortObject', () => {
    const obj = {
      dog: 'bark',
      car: 'beep',
      cat: 'meow',
    }
    expect(sortObject(obj)).toEqual({
      car: 'beep',
      cat: 'meow',
      dog: 'bark',
    })
  })

  it('deepSortObject', () => {
    const obj = {
      dog: {
        more: {
          sound1: 'woof',
          sound2: 'bark',
        },
        name: 'rex',
      },
      car: {
        name: 'wheelie',
        more: {
          sound2: 'beep',
          sound1: 'honk',
          parts: ['seat', 'windscreen', 'battery'],
        },
      },
    }
    expect(deepSortObject(obj)).toEqual({
      car: {
        more: {
          parts: ['seat', 'windscreen', 'battery'],
          sound1: 'honk',
          sound2: 'beep',
        },
        name: 'wheelie',
      },
      dog: {
        more: {
          sound1: 'woof',
          sound2: 'bark',
        },
        name: 'rex',
      },
    })
  })

  it('deepMerge', () => {
    const obj1 = {
      ob1Key: 'cat',
      shared: 'bird',
    }
    const obj2 = {
      obj2Key: 'dog',
      shared: 'bird',
    }
    const obj3 = {
      obj3Key: 'elephant',
    }
    expect(deepMerge(obj1, obj2)).toEqual({ ob1Key: 'cat', obj2Key: 'dog', shared: 'bird' })
    expect(deepMerge({ ...obj1, obj3 }, obj2)).toEqual({
      ob1Key: 'cat',
      obj2Key: 'dog',
      shared: 'bird',
      obj3: {
        obj3Key: 'elephant',
      },
    })
    expect(deepMerge(obj1, 'not an object')).toEqual(obj1)
    expect(deepMerge(obj1, { ...obj2, obj3 })).toEqual({
      ob1Key: 'cat',
      obj2Key: 'dog',
      obj3: {
        obj3Key: 'elephant',
      },
      shared: 'bird',
    })
    expect(deepMerge({ ...obj1, obj3 }, { ...obj2, obj3 })).toEqual({
      ob1Key: 'cat',
      obj2Key: 'dog',
      obj3: {
        obj3Key: 'elephant',
      },
      shared: 'bird',
    })
  })

  it('mapKeys', () => {
    const object = { a: 1, b: 2 }
    const mapper = (key, value) => key + value
    expect(mapKeys(mapper)(object)).toEqual({ a1: 1, b2: 2 })
  })

  it('mapValues', () => {
    const object = {
      fred: { user: 'fred', age: 40 },
      pebbles: { user: 'pebbles', age: 1 },
    }
    const mapper = ({ age }) => age
    expect(mapValues(mapper)(object)).toEqual({ fred: 40, pebbles: 1 })
  })

  it('get', () => {
    const obj = {
      a: {
        b: {
          c: 3,
        },
      },
    }

    expect(get('a.b.c')(obj)).toBe(3)
    expect(get('a.b')(obj)).toEqual(obj.a.b)
    expect(get('a.b.c.d')(obj)).toBeUndefined()
    expect(get('a.b.c')(undefined)).toBeUndefined()
    expect(get('a.b.c')(null)).toBeUndefined()
  })

  it('set', () => {
    const obj = {
      a: {
        b: {
          c: 3,
        },
      },
    }
    deepFreeze(obj)
    expect(set('a.b.c', 'dog')(obj)).toEqual({ a: { b: { c: 'dog' } } })
    expect(set('a.b.d', 'dog')(obj)).toEqual({ a: { b: { c: 3, d: 'dog' } } })
    expect(set('a.e.c', 'raccoon')(obj)).toEqual({ a: { b: { c: 3 }, e: { c: 'raccoon' } } })
    expect(obj).toEqual({ a: { b: { c: 3 } } })
  })
})

it('hasProperty', () => {
  const obj = {
    a: {
      b: {
        c: 3,
      },
    },
  }
  expect(hasProperty('a')(obj)).toBeTrue()
  expect(hasProperty('a.b.c')(obj)).toBeTrue()
  expect(hasProperty('b')(obj)).toBeFalse()
  expect(hasProperty()(obj)).toBeFalse()
  expect(hasProperty(null)(obj)).toBeFalse()
  expect(hasProperty(undefined)(obj)).toBeFalse()
  expect(hasProperty('a')()).toBeFalse()
  expect(hasProperty('a')(null)).toBeFalse()
  expect(hasProperty('a')(undefined)).toBeFalse()
})

it('dependantFieldsHash', () => {
  expect(dependantFieldsHash(['groupIds', 'mentorIds'])(assessmentReport)).toEqual('')
  expect(dependantFieldsHash(['groupIds', 'mentorIds'])(set('groupIds', [0, 1, 2])(assessmentReport))).toEqual('0,1,2')
  expect(dependantFieldsHash(['groupIds', 'mentorIds'])(pipe(
    set('groupIds', [0, 1, 2]),
    set('mentorIds', [3, 4, 5]),
  )(assessmentReport))).toEqual('0,1,23,4,5')
})
