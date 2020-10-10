import 'jest-localstorage-mock'

import {
  asHtml,
  capitalize,
  extractLink,
  includesString,
  intToLetter,
  isEmptyString,
  isJSON,
  isString,
  pluralize,
  prefix,
  split,
  suffix,
} from './strings'

beforeEach(jest.clearAllMocks)
afterEach(() => { process.env.NODE_ENV = 'test' })

describe('string tests', () => {
  it('isString', () => {
    expect(isString('cat')).toBeTrue()
    expect(isString('')).toBeTrue()
    expect(isString(String(123))).toBeTrue()
    expect(isString(123)).toBeFalse()
    expect(isString()).toBeFalse()
    expect(isString(null)).toBeFalse()
    expect(isString(undefined)).toBeFalse()
    expect(isString({})).toBeFalse()
    expect(isString(['array'])).toBeFalse()
    expect(isString(new Date())).toBeFalse()
  })

  it('includesString', () => {
    const mapper = includesString('away')
    expect(mapper('Give it away now')).toBe(true)
    expect(mapper('Castaway')).toBe(true)
    expect(mapper('aWaY')).toBe(true)
    expect(mapper('not here')).toBe(false)
  })

  it('isEmptyString', () => {
    expect(isEmptyString('dog')).toEqual(false)
    expect(isEmptyString('')).toEqual(true)
    expect(isEmptyString('   ')).toEqual(true)
    expect(isEmptyString(null)).toEqual(true)
    expect(isEmptyString(undefined)).toEqual(true)
    expect(isEmptyString(0)).toEqual(false)
    expect(isEmptyString('false')).toEqual(false)
    expect(isEmptyString('true')).toEqual(false)
    expect(isEmptyString(false)).toEqual(false)
    expect(isEmptyString(true)).toEqual(false)
  })

  it('extractLink', () => {
    expect(extractLink('<a href="http://google.com">text</a>')).toEqual({ link: 'http://google.com', text: 'text' })
    expect(extractLink('<a href="url">text</a>')).toEqual({ link: 'url', text: 'text' })
    expect(extractLink('<a>no href</a>')).toEqual({ link: null, text: '<a>no href</a>' })
    expect(extractLink('just text')).toEqual({ link: null, text: 'just text' })
  })

  it('pluralize', () => {
    expect(pluralize('dog')(3)).toBe('3 dogs')
    expect(pluralize('dog')(1)).toBe('1 dog')
    expect(pluralize('dog')(0)).toBe('0 dogs')
    expect(pluralize('dog')()).toBe('undefined dogs')
    expect(pluralize()(3)).toBe('3 undefineds')
    expect(pluralize('class')(1)).toBe('1 class')
    expect(pluralize('class')(3)).toBe('3 classes')
  })

  it('capitalize', () => {
    expect(capitalize('dog')).toBe('Dog')
    expect(capitalize('Dog')).toBe('Dog')
    expect(capitalize('')).toBe('')
    expect(capitalize('two words')).toBe('Two words')
    expect(capitalize()).toBe('')
    expect(capitalize(null)).toBe('')
    expect(capitalize(undefined)).toBe('')
    expect(capitalize(123)).toBe('')
    expect(capitalize({})).toBe('')
    expect(capitalize([])).toBe('')
    expect(capitalize(new Date())).toBe('')
  })

  it('split', () => {
    expect(split('|')('a|b|c')).toEqual(['a', 'b', 'c'])
    expect(split(':')()).toEqual([''])
    expect(split('-')('-')).toEqual(['', ''])
  })

  it('isJSON', () => {
    expect(isJSON('{"this": "is", "valid": true}')).toBeTrue()
    expect(isJSON('{"this": "is", "not": valid}')).toBeFalse()
  })

  it('asHtml', () => {
    const input1 = '<h1>Hi There</h1>'
    const input2 = <h1>Hi There</h1>
    const input3 = 'just the body text'
    expect(asHtml(input1)).toEqual({ dangerouslySetInnerHTML: { __html: input1 } })
    expect(asHtml(input2)).toEqual({ dangerouslySetInnerHTML: { __html: input2 } })
    expect(asHtml(input3)).toEqual({ dangerouslySetInnerHTML: { __html: input3 } })
    expect(asHtml(null)).toEqual({ dangerouslySetInnerHTML: { __html: null } })
  })

  it('prefix', () => {
    expect(prefix('pseudo-')('class')).toBe('pseudo-class')
    expect(prefix()('-class')).toBe('undefined-class')
    expect(prefix('pseudo-')()).toBe('pseudo-undefined')
    expect(prefix()()).toBe('undefinedundefined')
    expect(prefix(null)(null)).toBe('nullnull')
  })

  it('suffix', () => {
    expect(suffix('hood')('neighbor')).toBe('neighborhood')
    expect(suffix()('neighbor')).toBe('neighborundefined')
    expect(suffix('hood')()).toBe('undefinedhood')
    expect(suffix()()).toBe('undefinedundefined')
    expect(suffix(null)(null)).toBe('nullnull')
  })

  it('intToLetter', () => {
    expect(intToLetter(1)).toBe('A')
    expect(intToLetter()).toBe('A')
    expect(intToLetter('12')).toBe('L')
    expect(intToLetter(null)).toBe('A')
    expect(intToLetter(undefined)).toBe('A')
    expect(intToLetter(30)).toBe('D')
  })
})
