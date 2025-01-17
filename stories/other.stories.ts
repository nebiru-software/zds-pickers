import type { Meta, StoryObj } from '@storybook/react'
import type * as Soundfont from 'soundfont-player'
import OctavePlayer from '../lib/other/OctavePlayer.tsx'

const meta: Meta<typeof OctavePlayer> = {
  component: OctavePlayer,
}

type Story = StoryObj<typeof OctavePlayer>

export const Primary: Story = {
  args: {
    instrumentName: {
      control: { type: 'select' },
      options: [undefined, 'acoustic_grand_piano'],
    } as unknown as Soundfont.InstrumentName,
    height: 100,
    width: 200,
    octave: 4,
  },
}

export default meta
