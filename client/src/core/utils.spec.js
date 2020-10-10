import { fieldEmail, fieldFilename, fieldMaxLength64, fieldRequired, getSetting, validateFile } from './utils'

describe('util tests', () => {
  it('fieldRequired success', () => {
    const required = 'Required'
    expect(fieldRequired('value')).toBe(undefined)
    expect(fieldRequired(123)).toBe(undefined)
    expect(fieldRequired(0)).toEqual(required)
    expect(fieldRequired(-1)).toBe(undefined)
    expect(fieldRequired('')).toEqual(required)
    expect(fieldRequired(' ')).toBe(undefined)
    expect(fieldRequired(null)).toEqual(required)
    expect(fieldRequired(undefined)).toEqual(required)
    expect(fieldRequired(NaN)).toEqual(required)
  })

  it('fieldMaxLength64 success', () => {
    const error = 'Must be 64 characters or less'
    expect(fieldMaxLength64('value')).toBe(undefined)
    expect(fieldMaxLength64(''.padStart(64, '#'))).toBe(undefined)
    expect(fieldMaxLength64(''.padStart(65, '#'))).toEqual(error)
  })

  it('fieldEmail success', () => {
    const error = 'Invalid email address'
    expect(fieldEmail('user@email.com')).toBe(undefined)
    expect(fieldEmail('first.last@email.io')).toBe(undefined)
    expect(fieldEmail('gibberish')).toEqual(error)
  })

  it('fieldFilename success', () => {
    const error = 'Invalid filename'
    expect(fieldFilename('file.txt')).toBe(undefined)
    expect(fieldFilename('long name.txt')).toBe(undefined)
    expect(fieldFilename('gibberish')).toEqual(error)
  })

  it('validateFile success', () => {
    expect(validateFile({ name: 'file.txt', size: 2222 })).toEqual('')
    expect(validateFile()).toEqual('Required')
    expect(validateFile({ name: 'file.bak', size: 222 })).toEqual('Settings files must use .txt extension')
    expect(validateFile({ name: 'file.txt', size: 22 })).toEqual('File must be at least 1Kb in size')
    expect(validateFile({ name: 'file.txt', size: 22222 })).toEqual('File cannot exceed 5Kb in size')
  })

  it('getSetting', () => {
    expect(getSetting('animal', 'bear')).toEqual('bear')
    localStorage.setItem('animal', 'bear')
    expect(getSetting('animal', '')).toEqual('bear')
    localStorage.setItem('added', false)
    localStorage.setItem('count', 42)
    expect(getSetting('added', true)).toEqual(false)
    expect(getSetting('count', 0)).toEqual(42)
    const json = { key: 'value' }
    localStorage.setItem('someObject', JSON.stringify(json))
    expect(getSetting('someObject', {})).toEqual(json)
  })
})
