import { equals } from './utils'
import {
  arraySequence,
  chunk,
  dedupe,
  dedupeById,
  dedupeByKeys,
  difference,
  filter,
  find,
  findObj,
  first,
  getAt,
  intersection,
  isEmpty,
  last,
  map,
  orderBy,
  reduce,
  reverse,
  sample,
  sortBy,
  toKeyedObject,
  toggleItem,
  xDifference,
} from './arrays'

describe('array tests', () => {
  const obj1 = { id: 3703931, name: 'F, RONY', childCount: 1 }
  const obj2 = { id: 3562053, name: 'G, JAYDEN', childCount: 1 }

  const keyed1 = { key: 'abc' }
  const keyed2 = { key: 'def' }
  const keyed3 = { wrongKey: 'ghi' }

  it('arraySequence', () => {
    expect(arraySequence(0)).toEqual([])
    expect(arraySequence(5)).toEqual([0, 1, 2, 3, 4])
  })

  it('dedupe', () => {
    expect(dedupe([])).toEqual([])
    expect(dedupe(['dog'])).toEqual(['dog'])
    expect(dedupe(['dog', 'dog'])).toEqual(['dog'])
    expect(dedupe(['dog', 'cat', 'dog'])).toEqual(['dog', 'cat'])
    expect(dedupe([0, 0, 1, 2, 2, 3])).toEqual([0, 1, 2, 3])

    // It works for duped object by reference
    expect(dedupe([obj1, obj2])).toEqual([obj1, obj2])
    expect(dedupe([obj1, obj2, obj1])).toEqual([obj1, obj2])

    // It does NOT work for separate objects with the same signature
    // (use dedupeById for this case)
    expect(dedupe([
      { id: 3703931, name: 'F, RONY', childCount: 1 },
      { id: 3703931, name: 'F, RONY', childCount: 1 },
    ])).toEqual([
      { id: 3703931, name: 'F, RONY', childCount: 1 },
      { id: 3703931, name: 'F, RONY', childCount: 1 },
    ])
  })

  it('dedupeById', () => {
    // It works for duped object by reference
    expect(dedupeById([obj1, obj2])).toEqual([obj1, obj2])
    expect(dedupeById([obj1, obj2, obj1])).toEqual([obj1, obj2])

    // It works for separate objects with the same signature
    expect(dedupeById([
      { id: 3703931, name: 'F, RONY', childCount: 1 },
      { id: 3703931, name: 'F, RONY', childCount: 1 },
    ])).toEqual([{ id: 3703931, name: 'F, RONY', childCount: 1 }])
  })

  it('dedupeByKeys', () => {
    expect(dedupeByKeys([])).toEqual([])

    expect(dedupeByKeys([obj1, obj2], ['id'])).toEqual([obj1, obj2])
    expect(dedupeByKeys([obj1, obj2, obj1, obj2], ['id'])).toEqual([obj1, obj2])
  })

  it('map', () => {
    const arr = [0, 1, 2, 3]
    const fn = x => x + 1
    expect(map(fn)(arr)).toEqual([1, 2, 3, 4])
  })

  it('filter', () => {
    expect(filter(equals('b'))(['a', 'b', 3, 'd'])).toEqual(['b'])
    expect(filter(equals(3))(['a', 'b', 3, 'd'])).toEqual([3])
    expect(filter(equals('b'))([null, undefined, 'a', 'b', 3, 'd'])).toEqual(['b'])
    expect(filter(equals(3))()).toBeUndefined()
    expect(filter(equals(3))(null)).toBeUndefined()
    expect(filter(equals(3))(undefined)).toBeUndefined()
    // If there is no specific filter, all items are returned
    expect(filter()([1, 2, 3])).toEqual([1, 2, 3])
    expect(filter(undefined)([1, 2, 3])).toEqual([1, 2, 3])
    expect(filter(null)([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('reduce', () => {
    const r = (v, acc) => acc + v
    expect(reduce(r, 0)([1, 2, 3, 4])).toEqual(10)
    expect(reduce(r, 5)([1, 2, 3, 4])).toEqual(15)
    expect(reduce(r)([1, 2, 3, 4])).toBeNaN()
    expect(reduce()([1, 2, 3, 4])).toBeUndefined()
    expect(reduce(null)([1, 2, 3, 4])).toBeUndefined()
    expect(reduce(undefined)([1, 2, 3, 4])).toBeUndefined()
    expect(reduce()()).toBeUndefined()
    expect(reduce()(null)).toBeUndefined()
    expect(reduce()(undefined)).toBeUndefined()
  })

  it('find', () => {
    expect(find(equals('b'))(['a', 'b', 3, 'd'])).toEqual('b')
    expect(find(equals(3))(['a', 'b', 3, 'd'])).toEqual(3)
    expect(find(equals('b'))([null, undefined, 'a', 'b', 3, 'd'])).toEqual('b')
    expect(find(equals(3))()).toBeUndefined()
    expect(find(equals(3))(null)).toBeUndefined()
    expect(find(equals(3))(undefined)).toBeUndefined()
    // If there is no specific filter, the first item is returned
    expect(find()([1, 2, 3])).toEqual(1)
    expect(find(undefined)([1, 2, 3])).toEqual(1)
    expect(find(null)([1, 2, 3])).toEqual(1)
  })

  it('findObj', () => {
    expect(findObj('name', 'F, RONY')([obj1, obj2])).toEqual(obj1)
    expect(findObj('name', 'F, RONY')([null, undefined, obj1, obj2])).toEqual(obj1)
    expect(findObj('notName', 'F, RONY')([obj1, obj2])).toBeUndefined()
    expect(findObj('name', 'F, RONY')()).toBeUndefined()
    expect(findObj('name', 'F, RONY')(null)).toBeUndefined()
    expect(findObj('name', 'F, RONY')(undefined)).toBeUndefined()
    expect(findObj('name')([obj1, obj2])).toBeUndefined()
    // If there is no specific filter, the first item is returned
    expect(findObj()([obj1, obj2])).toEqual(obj1)
    expect(findObj(undefined)([obj2, obj1])).toEqual(obj2)
    expect(findObj(null)([obj1, obj2])).toEqual(obj1)
  })

  it('first', () => {
    expect(first([1, 2, 3])).toBe(1)
    expect(first([])).toBeUndefined()
    expect(first('cat')).toBe('c')
    expect(first()).toBeUndefined()
    expect(first(null)).toBeUndefined()
    expect(first(undefined)).toBeUndefined()
  })

  it('intersection', () => {
    expect(intersection([1, 2, 3])([4, 5, 6])).toEqual([])
    expect(intersection([1, 2, 3, 4, 5, '6'])([4, 5, 6])).toEqual([4, 5])
    expect(intersection()([4, 5, 6])).toEqual([])
    expect(intersection([1, 2, 3])()).toEqual([])
    expect(intersection(null)([4, 5, 6])).toBeUndefined()
    expect(intersection([1, 2, 3])(null)).toEqual([])
    expect(intersection(undefined)([4, 5, 6])).toEqual([])
    expect(intersection([1, 2, 3])(undefined)).toEqual([])
  })

  it('difference', () => {
    expect(difference([1, 2, 3])([4, 5, 6])).toEqual([1, 2, 3])
    expect(difference([1, 2, 3, 4, 5, '6'])([4, 5, 6])).toEqual([1, 2, 3, '6'])
    expect(difference()([4, 5, 6])).toEqual([])
    expect(difference([1, 2, 3])()).toEqual([1, 2, 3])
    expect(difference(null)([4, 5, 6])).toBeUndefined()
    expect(difference([1, 2, 3])(null)).toEqual([1, 2, 3])
    expect(difference(undefined)([4, 5, 6])).toEqual([])
    expect(difference([1, 2, 3])(undefined)).toEqual([1, 2, 3])
  })

  it('xDifference', () => {
    expect(xDifference([1, 2, 3])([4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6])
    expect(xDifference([1, 2, 3, 4, 5, '6'])([4, 5, 6])).toEqual([1, 2, 3, '6', 6])
    expect(xDifference()([4, 5, 6])).toEqual([4, 5, 6])
    expect(xDifference([1, 2, 3])()).toEqual([1, 2, 3])
    expect(xDifference(null)([4, 5, 6])).toBeUndefined()
    expect(xDifference([1, 2, 3])(null)).toEqual([1, 2, 3, undefined])
    expect(xDifference(undefined)([4, 5, 6])).toEqual([4, 5, 6])
    expect(xDifference([1, 2, 3])(undefined)).toEqual([1, 2, 3])
  })

  it('last', () => {
    expect(last([1, 2, 3])).toBe(3)
    expect(last([])).toBeUndefined()
    expect(last('cat')).toBe('t')
    expect(last()).toBeUndefined()
    expect(last(null)).toBeUndefined()
    expect(last(undefined)).toBeUndefined()
  })

  it('isEmpty', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(true)).toBe(false)
    expect(isEmpty(1)).toBe(false)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty([1, 2, 3])).toBe(false)
    expect(isEmpty({ a: 1 })).toBe(false)
  })

  it('sortBy', () => {
    expect(sortBy('key')(keyed1, keyed2)).toEqual(-1)
    expect(sortBy('key')(keyed2, keyed1)).toEqual(1)
    expect(sortBy('key')(keyed1, keyed1)).toEqual(0)
    expect(sortBy('key')(keyed1, keyed3)).toEqual(0)

    expect(sortBy('key', 'ASC')(keyed1, keyed2)).toEqual(-1)
    expect(sortBy('key', 'DESC')(keyed1, keyed2)).toEqual(1)
    expect(sortBy('key', 'ASC')(keyed1, keyed3)).toEqual(0)
    expect(sortBy('key', 'DESC')(keyed1, keyed3)).toEqual(0)
  })

  it('orderBy', () => {
    expect(orderBy([keyed1, keyed2, keyed3])('key')).toEqual([keyed1, keyed2, keyed3])
    expect(orderBy([keyed2, keyed1, keyed3])('key')).toEqual([keyed1, keyed2, keyed3])
    // ?? does this one make sense?
    expect(orderBy([keyed2, keyed3, keyed1])('key')).toEqual([keyed2, keyed3, keyed1])
  })

  it('sample', () => {
    const values = ['cat', 'dog', 'raccoon']
    expect(values).toContain(sample(values)[0])
    expect(sample([])).toHaveLength(0)
    expect(sample(undefined)).toHaveLength(0)
  })

  it('reverse', () => {
    const orig = ['one', 'two', 'three']
    const reversed = reverse(orig)
    expect(reversed).toEqual(['three', 'two', 'one'])
    expect(orig).toEqual(['one', 'two', 'three'])
  })

  it('getAt', () => {
    expect(getAt([1, 2, 3], 1)).toBe(2)
    expect(getAt([], 99)).toBeUndefined()
    expect(getAt('cat', 1)).toBe('a')
    expect(getAt([])).toBeUndefined()
    expect(getAt()).toBeUndefined()
    expect(getAt(null)).toBeUndefined()
    expect(getAt(undefined)).toBeUndefined()
  })

  it('chunk', () => {
    expect(chunk(1)(['a', 'b', 'c', 'd'])).toEqual([['a'], ['b'], ['c'], ['d']])
    expect(chunk(2)(['a', 'b', 'c', 'd'])).toEqual([['a', 'b'], ['c', 'd']])
    expect(chunk(3)(['a', 'b', 'c', 'd'])).toEqual([['a', 'b', 'c'], ['d']])
    expect(chunk(4)(['a', 'b', 'c', 'd'])).toEqual([['a', 'b', 'c', 'd']])
    expect(chunk(5)(['a', 'b', 'c', 'd'])).toEqual([['a', 'b', 'c', 'd']])
  })

  it('toKeyedObject', () => {
    const keyedObj1 = { id: 'a1', name: 'one' }
    const keyedObj2 = { id: 'a2', name: 'two' }
    expect(toKeyedObject([keyedObj1, keyedObj2])).toEqual({ a1: keyedObj1, a2: keyedObj2 })
    expect(toKeyedObject([keyedObj1, keyedObj2], 'nonExistentKey')).toEqual({})
    expect(toKeyedObject()).toEqual({})
    expect(toKeyedObject(null)).toEqual({})

    const keyedObj3 = { questionId: 'a1', name: 'one' }
    const keyedObj4 = { questionId: 'a2', name: 'two' }
    expect(toKeyedObject([keyedObj3, keyedObj4], 'questionId')).toEqual({ a1: keyedObj3, a2: keyedObj4 })
  })

  it('toggleItem', () => {
    expect(toggleItem([1, 2, 3])(2)).toEqual([1, 3])
    expect(toggleItem([1, 2, 3])(4)).toEqual([1, 2, 3, 4])
    expect(toggleItem([1, 2, 3])('dog')).toEqual([1, 2, 3, 'dog'])
    expect(toggleItem([])(2)).toEqual([2])
    expect(toggleItem([1, 2, 3])(null)).toEqual([1, 2, 3, null])
  })
})
