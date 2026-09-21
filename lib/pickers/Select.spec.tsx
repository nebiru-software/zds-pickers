// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Select } from './Select'

const noteOn = [{ label: 'Note On', value: 9 }]
const controls = [
  { label: 'Control Change', value: 11 },
  { label: 'Program Change', value: 12 },
]

const noop = () => {}

afterEach(cleanup)

describe('Select', () => {
  it('shows the option matching its value', () => {
    const { container } = render(
      <Select label="MIDI Message" onChange={noop} options={controls} value={11} />,
    )

    expect(container.textContent).toContain('Control Change')
  })

  // react-select treats an undefined value as uncontrolled and keeps its last
  // option, so a value matching nothing used to inherit the previous label.
  it('shows nothing, not the previous option, when its value stops matching', () => {
    const { container, rerender } = render(
      <Select label="MIDI Message" onChange={noop} options={noteOn} value={9} />,
    )
    expect(container.textContent).toContain('Note On')

    rerender(
      <Select label="MIDI Message" onChange={noop} options={controls} value={9} />,
    )

    expect(container.textContent).not.toContain('Note On')
    expect(container.textContent).not.toContain('Control Change')
  })
})
