import { describe, expect, it } from 'vitest'
import { buildValueArcPath } from './arcPath'

/** Parse "M x1 y1 A r r 0 large sweep x2 y2" into numbers. */
const parse = (d: string) => {
  const m = d.match(
    /^M (-?[\d.]+) (-?[\d.]+) A (-?[\d.]+) (-?[\d.]+) 0 ([01]) ([01]) (-?[\d.]+) (-?[\d.]+)$/,
  )
  if (!m) throw new Error(`unparseable path: ${d}`)
  const [, x1, y1, r1, r2, large, sweep, x2, y2] = m.map(Number)
  return { x1, y1, r1, r2, large, sweep, x2, y2 }
}

// Knob defaults: clamp 40..320, rotate 180, center (100,100), r 93.
// Screen angles (clockwise from 12 o'clock): min -> 220, mid -> 0, max -> 140.
const at = (deg: number, r = 93) => {
  const rad = (deg * Math.PI) / 180
  return { x: 100 + r * Math.sin(rad), y: 100 - r * Math.cos(rad) }
}

describe('buildValueArcPath', () => {
  it('draws nothing at min (non-centered anchor)', () => {
    expect(buildValueArcPath({ value: 0, min: 0, max: 127 })).toBe('')
  })

  it('draws the full 280-degree sweep at max with the large-arc flag', () => {
    const arc = parse(buildValueArcPath({ value: 127, min: 0, max: 127 }))
    const start = at(220)
    const end = at(140)
    expect(arc.x1).toBeCloseTo(start.x, 2)
    expect(arc.y1).toBeCloseTo(start.y, 2)
    expect(arc.x2).toBeCloseTo(end.x, 2)
    expect(arc.y2).toBeCloseTo(end.y, 2)
    expect(arc.large).toBe(1)
    expect(arc.sweep).toBe(1)
    expect(arc.r1).toBe(93)
  })

  it('keeps large-arc off for sweeps at or under 180 degrees', () => {
    // Half of the 280-degree throw is 140 degrees.
    const arc = parse(buildValueArcPath({ value: 63.5, min: 0, max: 127 }))
    expect(arc.large).toBe(0)
    expect(arc.sweep).toBe(1)
    // Midpoint value lands at 12 o'clock.
    expect(arc.x2).toBeCloseTo(100, 2)
    expect(arc.y2).toBeCloseTo(7, 2)
  })

  it('draws nothing at the midpoint when centered', () => {
    expect(
      buildValueArcPath({ value: 63.5, min: 0, max: 127, centered: true }),
    ).toBe('')
  })

  it('centered positive values arc clockwise from 12 o-clock', () => {
    const arc = parse(
      buildValueArcPath({ value: 127, min: 0, max: 127, centered: true }),
    )
    const end = at(140)
    expect(arc.x1).toBeCloseTo(100, 2)
    expect(arc.y1).toBeCloseTo(7, 2)
    expect(arc.x2).toBeCloseTo(end.x, 2)
    expect(arc.y2).toBeCloseTo(end.y, 2)
    expect(arc.sweep).toBe(1)
    expect(arc.large).toBe(0)
  })

  it('centered negative values arc counterclockwise from 12 o-clock', () => {
    const arc = parse(
      buildValueArcPath({ value: 0, min: 0, max: 127, centered: true }),
    )
    const end = at(220)
    expect(arc.x1).toBeCloseTo(100, 2)
    expect(arc.y1).toBeCloseTo(7, 2)
    expect(arc.x2).toBeCloseTo(end.x, 2)
    expect(arc.y2).toBeCloseTo(end.y, 2)
    expect(arc.sweep).toBe(0)
    expect(arc.large).toBe(0)
  })

  it('works with negative display ranges (client centered remap)', () => {
    // CenteredKnobPicker hands the knob min=-63 max=63.
    const positive = parse(
      buildValueArcPath({ value: 30, min: -63, max: 63, centered: true }),
    )
    expect(positive.sweep).toBe(1)
    const negative = parse(
      buildValueArcPath({ value: -30, min: -63, max: 63, centered: true }),
    )
    expect(negative.sweep).toBe(0)
  })

  it('clamps values outside min/max', () => {
    const over = buildValueArcPath({ value: 500, min: 0, max: 127 })
    const max = buildValueArcPath({ value: 127, min: 0, max: 127 })
    expect(over).toBe(max)
  })

  it('degenerate range draws nothing', () => {
    expect(buildValueArcPath({ value: 5, min: 5, max: 5 })).toBe('')
  })
})
