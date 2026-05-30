import type { ReactNode } from 'react'
import type Soundfont from 'soundfont-player'
import type { TooltipProps } from './DefaultTooltip'

type NoteLabelRenderProps = {
  isAccidental: boolean
  isActive: boolean
  keyboardShortcut?: string | null
  midiNumber: number
}

type PianoMidiNote = {
  accidental: boolean
  left: number
  midiNumber: number
  width: number
}

type PianoProps = {
  className?: string
  disabled?: boolean
  height: number
  renderNoteLabel?: (props: NoteLabelRenderProps) => ReactNode
  selectedNotes?: number[]
  width: number
}

type PianoProviderProps = PianoProps & {
  format?: 'mp3' | 'ogg'
  hostname?: string
  instrumentName?: Soundfont.InstrumentName
  octave?: number
  onChange?: (note: number) => void
  onClick?: (note: number) => void
  onDoubleClick?: (note: number) => void
  onKeyMouseEnter?: (note: PianoMidiNote) => void
  onKeyMouseLeave?: (note: number) => void
  soundfont?: 'MusyngKite' | 'FluidR3_GM'
  Tooltip?: TooltipProps
}

type OctavePlayerProps = PianoProps & {
  octave: number
}

export type {
  NoteLabelRenderProps,
  OctavePlayerProps,
  PianoMidiNote,
  PianoProps,
  PianoProviderProps,
}
