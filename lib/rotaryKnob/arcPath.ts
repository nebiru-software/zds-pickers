/**
 * Pure geometry for the knob's value-arc fill.
 *
 * Angle convention matches RotaryKnob's convertValueToAngle: a value maps
 * linearly onto [clampMin, clampMax] sweep degrees, then rotateDegrees is
 * added (mod 360). The resulting angle is measured clockwise from 12 o'clock,
 * because the skin's #knob indicator points up at rotation 0.
 *
 * With Knob's constants (clampMin 40, clampMax 320, rotateDegrees 180):
 * min → 220° (bottom-left), max → 140° (bottom-right), midpoint → 0° (top).
 */

type ValueArcOptions = {
  value: number
  min: number
  max: number
  /** Anchor the arc at the sweep midpoint (12 o'clock) instead of min. */
  centered?: boolean
  cx?: number
  cy?: number
  r?: number
  clampMin?: number
  clampMax?: number
  rotateDegrees?: number
}

/** Below this many sweep degrees no arc is drawn (avoids zero-length paths). */
const MIN_ARC_DEGREES = 0.5

const point = (
  cx: number,
  cy: number,
  r: number,
  clockwiseFromTopDeg: number,
): [number, number] => {
  const rad = (clockwiseFromTopDeg * Math.PI) / 180
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)]
}

const fmt = (n: number): string => String(Math.round(n * 1000) / 1000)

/**
 * SVG path `d` for the arc from the anchor (min, or sweep midpoint when
 * centered) to the current value. Empty string when there is nothing to draw.
 */
const buildValueArcPath = ({
  value,
  min,
  max,
  centered = false,
  cx = 100,
  cy = 100,
  r = 93,
  clampMin = 40,
  clampMax = 320,
  rotateDegrees = 180,
}: ValueArcOptions): string => {
  if (max === min) return ''

  const ratio = Math.min(1, Math.max(0, (value - min) / (max - min)))
  const sweepValue = clampMin + ratio * (clampMax - clampMin)
  const sweepAnchor = centered ? (clampMin + clampMax) / 2 : clampMin

  const delta = sweepValue - sweepAnchor
  if (Math.abs(delta) < MIN_ARC_DEGREES) return ''

  const angleOf = (sweep: number) =>
    (((sweep + rotateDegrees) % 360) + 360) % 360

  const [x1, y1] = point(cx, cy, r, angleOf(sweepAnchor))
  const [x2, y2] = point(cx, cy, r, angleOf(sweepValue))

  const largeArc = Math.abs(delta) > 180 ? 1 : 0
  const sweepFlag = delta > 0 ? 1 : 0

  return `M ${fmt(x1)} ${fmt(y1)} A ${fmt(r)} ${fmt(r)} 0 ${largeArc} ${sweepFlag} ${fmt(x2)} ${fmt(y2)}`
}

export { buildValueArcPath }
export type { ValueArcOptions }
