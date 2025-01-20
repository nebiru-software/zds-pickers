import type Soundfont from 'soundfont-player'
import { /* Midi, */ Note } from 'tonal'
import { Piano as ReactPiano } from 'zds-react-piano'
import type { TooltipProps } from './DefaultTooltip'
import SoundfontProvider from './SoundFontProvider'

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

// const { midiToFreq, midiToNoteName } = Midi

// console.log(Note.names(), Note.midi('C4'))

// const firstNote = 21
// const lastNote = 108
const numNotes = 12

const whiteNotes = numNotes * 0.7 // approx

const audioContext = new window.AudioContext()

type OctavePlayerProps = {
  disabled?: boolean
  height: number
  octave: number
  width: number
}

const OctavePlayer = ({
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

type WithProviderProps = {
  format?: 'mp3' | 'ogg'
  height: number
  hostname?: string
  instrumentName: Soundfont.InstrumentName
  octave?: number
  onChange?: (note: number) => void
  onClick?: (note: number) => void
  onDoubleClick?: (note: number) => void
  onKeyMouseEnter?: (note: number) => void
  onKeyMouseLeave?: (note: number) => void
  soundfont?: 'MusyngKite' | 'FluidR3_GM'
  Tooltip?: TooltipProps
  width: number
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
  soundfont,
  Tooltip,
  width,
}: WithProviderProps) => (
  <SoundfontProvider
    {...{
      audioContext,
      format,
      hostname,
      instrumentName,
      onChange,
      soundfont,
    }}
    render={({
      isLoading,
      playNote,
      stopNote,
    }: {
      isLoading: boolean
      playNote: (midiNumber: number) => void
      stopNote: (midiNumber: number) => void
    }) => (
      <>
        <div>
          <h2>Octave: {octave}</h2>
        </div>
        <OctavePlayer
          disabled={isLoading}
          {...{
            height,
            octave,
            onClick,
            onDoubleClick,
            onKeyMouseEnter,
            onKeyMouseLeave,
            playNote,
            stopNote,
            Tooltip,
            width,
          }}
        />
      </>
    )}
  />
)

export default WithProvider

export type { WithProviderProps }
