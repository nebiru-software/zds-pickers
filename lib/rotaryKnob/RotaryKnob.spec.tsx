// @vitest-environment jsdom
import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { RotaryKnob } from './index'

const noop = () => {}

afterEach(cleanup)

const knobTransform = (container: HTMLElement) =>
  container.querySelector('#knob')?.getAttribute('transform') ?? ''

// The knob is drawn by react-svgmt: SvgLoader injects the skin's SVG and
// SvgProxy rewrites the #knob transform. Nothing else covers that path.
describe('RotaryKnob', () => {
  it('injects the skin and rotates the knob element to its value', async () => {
    const { container, rerender } = render(
      <RotaryKnob max={127} min={0} onChange={noop} style={{}} value={0} />,
    )

    await waitFor(() => expect(knobTransform(container)).toContain('rotate('))
    const atMin = knobTransform(container)

    rerender(<RotaryKnob max={127} min={0} onChange={noop} style={{}} value={100} />)

    await waitFor(() => expect(knobTransform(container)).not.toBe(atMin))
    expect(knobTransform(container)).toContain('rotate(')
  })
})
