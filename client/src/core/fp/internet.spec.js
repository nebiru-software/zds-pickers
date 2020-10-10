import 'jest-localstorage-mock'

import {
  appendScript,
  assertId,
  buildUrl,
  buildUrlParams,
  storage,
} from './internet'

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'dMdXNsqEq'),
}))

beforeEach(jest.clearAllMocks)
afterEach(() => { process.env.NODE_ENV = 'test' })

describe('internet tests', () => {
  it('buildUrlParams', () => {
    expect(buildUrlParams({})).toEqual('')
    expect(buildUrlParams({ dog: '123', cat: 'bird' })).toEqual('dog=123&cat=bird')
    expect(buildUrlParams({}, false)).toEqual('')
    expect(buildUrlParams({ dog: '123', cat: 'bird' }, false)).toEqual('dog=123&cat=bird')
    expect(buildUrlParams({ parent: { child: 'content' } }, false)).toEqual('parent=%7B%22child%22:%22content%22%7D')
    expect(buildUrlParams({ parent: { child: 'content' } }, true)).toEqual('parent=N4IgxgFglgNgJiAXOA9gOwC4FNMgL5A')
  })

  it('buildUrl', () => {
    const uri = 'http://0.0.0.0/base'
    expect(buildUrl(uri)).toEqual(uri)
    expect(buildUrl(uri, {})).toEqual(uri)
    expect(buildUrl(uri, { dog: '123', cat: 'bird' })).toEqual(`${uri}?dog=123&cat=bird`)
  })

  it('appendScript', () => {
    const src = 'https://apis.google.com/js/platform.js?onload=googleReady'

    expect(document.head.children.length).toBe(0)
    appendScript({
      src,
      async: true,
      defer: true,
    })

    expect(document.head.children.length).toBe(1)
    expect(document.head.children[0].src).toEqual(src)
    expect(document.head.children[0].async).toBeTruthy()
    expect(document.head.children[0].defer).toBeTruthy()
  })

  it('assertId', () => {
    expect(assertId(12345)).toEqual(12345)
    expect(assertId()).toEqual('gen-dMdXNsqEq')
  })

  it('storage', () => {
    // expect(JSON.stringify(storage())).toEq()
    expect(String(storage())).toEqual('[object Storage]')

    process.env.NODE_ENV = 'other'

    expect(String(storage())).toEqual('[object Storage]')
  })
})
