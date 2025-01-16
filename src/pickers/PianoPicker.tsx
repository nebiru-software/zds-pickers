import type { WithProviderProps } from 'src/other/OctavePlayer'
import { Piano as ReactPiano } from 'zds-react-piano'
import SoundfontProvider from '../other/SoundFontProvider'

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

const PianoPicker = ({ height, width, ...rest }: PianoProps) => {
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
      <PianoPicker
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

export default WithProvider
