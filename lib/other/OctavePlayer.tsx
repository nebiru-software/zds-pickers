import { /* Midi, */ Note } from 'tonal'
import { Piano as ReactPiano } from 'zds-react-piano'
import { SoundfontProvider } from './SoundFontProvider'
import type {
  OctavePlayerProps,
  PianoMidiNote,
  PianoProviderProps,
} from './pianoTypes'

const baseNotes = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

const numNotes = 12

const whiteNotes = numNotes * 0.7 // approx

const audioContext = new window.AudioContext()

const BaseOctavePlayer = ({
  octave,
  height,
  width,
  ...rest
}: OctavePlayerProps) => {
  const keyWidth = width / whiteNotes + 2
  const keyWidthToHeight = keyWidth / height

  const firstNote = Note.midi(baseNotes[0] + String(octave)) || 0
  const lastNote =
    Note.midi(baseNotes[baseNotes.length - 1] + String(octave)) || 0

  return (
    <div>
      <ReactPiano
        keyWidthToHeight={keyWidthToHeight}
        noteRange={{ first: firstNote, last: lastNote }}
        width={width}
        {...rest}
      />
    </div>
  )
}

const WithProvider = ({
  format,
  height,
  hostname,
  instrumentName,
  octave = 4,
  onChange,
  onClick,
  onDoubleClick,
  onKeyMouseEnter,
  onKeyMouseLeave,
  selectedNotes,
  soundfont,
  Tooltip,
  width,
}: PianoProviderProps) => (
  <SoundfontProvider
    {...{
      audioContext,
      format,
      hostname,
      instrumentName,
      onChange,
      soundfont,
    }}
    render={({ isLoading, playNote, stopNote }) => (
      <BaseOctavePlayer
        disabled={isLoading}
        {...{
          height,
          octave,
          onClick,
          onDoubleClick,
          onKeyMouseEnter,
          onKeyMouseLeave,
          playNote,
          selectedNotes,
          stopNote,
          Tooltip,
          width,
        }}
      />
    )}
  />
)

export { WithProvider as OctavePlayer }

export type { OctavePlayerProps, PianoMidiNote, PianoProviderProps }

/** @deprecated Use PianoProviderProps */
export type WithProviderProps = PianoProviderProps
