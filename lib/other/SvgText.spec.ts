import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetFontMetricsCacheForTests,
  calculateWordsByLines,
  calculateWordWidths,
  type WordWidths,
} from './SvgText'

const makeStyle = (overrides: Record<string, string> = {}) =>
  ({
    getPropertyValue: (key: string) => overrides[key] ?? '',
    getPropertyPriority: () => '',
  }) as unknown as CSSStyleDeclaration

// Duck-typed measurement node: width tracks textContent length so word
// widths are deterministic without a DOM.
const makeTextNode = () => {
  const calls = { setProperty: [] as string[], getBBox: 0 }
  let content = ''
  const node = {
    style: {
      setProperty: (key: string) => {
        calls.setProperty.push(key)
      },
    },
    get textContent() {
      return content
    },
    set textContent(value: string) {
      content = value
    },
    getBBox: () => {
      calls.getBBox += 1
      return { width: content.length * 10, height: 12 }
    },
    getComputedTextLength: () => 5,
    setAttribute: () => {},
  }
  return { node: node as unknown as SVGGraphicsElement, calls }
}

describe('calculateWordWidths caching', () => {
  beforeEach(() => {
    __resetFontMetricsCacheForTests()
  })

  it('measures each unique word once, including the metrics probe', () => {
    const { node, calls } = makeTextNode()
    const result = calculateWordWidths(makeStyle(), node, 'kick snare kick')

    expect(result?.wordsWithComputedWidth).toEqual({ kick: 40, snare: 50 })
    // one lineHeight probe + one per unique word
    expect(calls.getBBox).toBe(3)
    expect(result?.spaceWidth).toBe(5)
    expect(result?.lineHeight).toBe(12)
  })

  it('serves repeat text from the cache without touching the node', () => {
    const first = makeTextNode()
    calculateWordWidths(makeStyle(), first.node, 'kick snare')

    const second = makeTextNode()
    const result = calculateWordWidths(makeStyle(), second.node, 'snare kick')

    expect(result?.wordsWithComputedWidth).toEqual({ kick: 40, snare: 50 })
    expect(second.calls.getBBox).toBe(0)
    expect(second.calls.setProperty).toHaveLength(0)
  })

  it('measures only the words missing from the cache', () => {
    const first = makeTextNode()
    calculateWordWidths(makeStyle(), first.node, 'kick')

    const second = makeTextNode()
    calculateWordWidths(makeStyle(), second.node, 'kick tom')

    // just the new word — no re-probe of lineHeight, no re-measure of kick
    expect(second.calls.getBBox).toBe(1)
  })

  it('keys the cache by font signature', () => {
    const first = makeTextNode()
    calculateWordWidths(makeStyle({ 'font-size': '12px' }), first.node, 'kick')

    const second = makeTextNode()
    calculateWordWidths(
      makeStyle({ 'font-size': '24px' }),
      second.node,
      'kick',
    )

    // different font → fresh probe + fresh word measurement
    expect(second.calls.getBBox).toBe(2)
  })

  it('copies only font-affecting properties onto the measurement node', () => {
    const { node, calls } = makeTextNode()
    calculateWordWidths(makeStyle(), node, 'kick')

    expect(calls.setProperty.length).toBeGreaterThan(0)
    expect(calls.setProperty.length).toBeLessThan(20)
    for (const key of calls.setProperty) {
      expect(key).toMatch(
        /^(font-|letter-spacing|word-spacing|text-transform)/,
      )
    }
  })

  it('returns undefined without a style or node', () => {
    expect(calculateWordWidths(undefined, null, 'kick')).toBeUndefined()
  })
})

describe('calculateWordsByLines', () => {
  const widths = (
    wordsWithComputedWidth: Record<string, number>,
  ): WordWidths => ({
    wordsWithComputedWidth,
    spaceWidth: 5,
    lineHeight: 10,
  })

  it('wraps words that exceed maxWidth onto new lines', () => {
    const lines = calculateWordsByLines(
      'one two three',
      widths({ one: 30, two: 30, three: 50 }),
      70,
      1000,
    )

    expect(lines.map(line => line.words)).toEqual([['one', 'two'], ['three']])
  })

  it('hides lines that would overflow maxHeight', () => {
    const lines = calculateWordsByLines(
      'one two',
      widths({ one: 60, two: 60 }),
      70,
      15, // room for one 10px line only
    )

    expect(lines.map(line => line.showLine)).toEqual([true, false])
  })
})
