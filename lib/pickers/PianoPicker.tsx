import { Piano as ReactPiano } from 'zds-react-piano'
import type { WithProviderProps } from '../other/OctavePlayer'
import { SoundfontProvider } from '../other/SoundFontProvider'

const firstNote = 21
const lastNote = 108
const numNotes = lastNote - firstNote - 1

const whiteNotes = numNotes * 0.7 // approx

const audioContext = new window.AudioContext()

type PianoProps = {
  disabled: boolean
  height: number
  width: number
}

const BasePianoPicker = ({ height, width, ...rest }: PianoProps) => {
  const keyWidth = width / whiteNotes + 2
  const keyWidthToHeight = keyWidth / height

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
  onChange,
  onClick,
  onDoubleClick,
  onKeyMouseEnter,
  onKeyMouseLeave,
  soundfont,
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
    render={({ isLoading, playNote, stopNote }) => (
      <BasePianoPicker
        disabled={isLoading}
        {...{
          height,
          onClick,
          onDoubleClick,
          onKeyMouseEnter,
          onKeyMouseLeave,
          playNote,
          stopNote,
          width,
        }}
      />
    )}
  />
)

export { WithProvider as PianoPicker }

export type { PianoProps }
