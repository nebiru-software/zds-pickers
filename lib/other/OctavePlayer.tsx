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
  className,
  octave,
  height,
  renderNoteLabel,
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
        className={className}
        keyWidthToHeight={keyWidthToHeight}
        noteRange={{ first: firstNote, last: lastNote }}
        renderNoteLabel={renderNoteLabel}
        width={width}
        {...rest}
      />
    </div>
  )
}

const WithProvider = ({
  className,
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
  renderNoteLabel,
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
          className,
          height,
          octave,
          onClick,
          onDoubleClick,
          onKeyMouseEnter,
          onKeyMouseLeave,
          playNote,
          renderNoteLabel,
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
