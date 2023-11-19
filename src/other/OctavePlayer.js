import React from 'react'
import PropTypes from 'prop-types'
import { /* Midi, */ Note } from 'tonal'
import { Piano as ReactPiano } from 'zds-react-piano'
import SoundfontProvider from './SoundFontProvider'
import DefaultTooltip from './DefaultTooltip'

const baseNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// const { midiToFreq, midiToNoteName } = Midi

// console.log(Note.names(), Note.midi('C4'))

// const firstNote = 21
// const lastNote = 108
const numNotes = 12

const whiteNotes = numNotes * 0.7 // approx

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

const OctavePlayer = ({ octave, height, width, ...rest }) => {
  const keyWidth = (width / whiteNotes) + 2
  const keyWidthToHeight = keyWidth / height

  const firstNote = Note.midi(baseNotes[0] + String(octave))
  const lastNote = Note.midi(baseNotes[baseNotes.length - 1] + String(octave))

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
  octave,
  onChange,
  onClick,
  onDoubleClick,
  onKeyMouseEnter,
  onKeyMouseLeave,
  soundfont,
  Tooltip,
  width,
}) => (
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
    )}
  />
)

OctavePlayer.propTypes = {
  height: PropTypes.number.isRequired,
  octave: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
}

WithProvider.propTypes = {
  format: PropTypes.oneOf(['mp3', 'ogg']),
  height: PropTypes.number.isRequired,
  hostname: PropTypes.string,
  instrumentName: PropTypes.string,
  octave: PropTypes.number,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onKeyMouseEnter: PropTypes.func,
  onKeyMouseLeave: PropTypes.func,
  soundfont: PropTypes.oneOf(['MusyngKite', 'FluidR3_GM']),
  Tooltip: PropTypes.elementType,
  width: PropTypes.number.isRequired,
}

WithProvider.defaultProps = {
  format: undefined, // 'mp3',
  hostname: undefined,
  instrumentName: undefined,
  octave: 4,
  onChange: undefined,
  onClick: undefined,
  onDoubleClick: undefined,
  onKeyMouseEnter: undefined,
  onKeyMouseLeave: undefined,
  soundfont: undefined, // 'MusyngKite',
  Tooltip: DefaultTooltip,
}

export default WithProvider
