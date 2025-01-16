import OctavePlayer from '../lib/other/OctavePlayer.tsx'
import type Soundfont from 'soundfont-player'
import type { Meta, StoryObj } from '@storybook/react'

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
