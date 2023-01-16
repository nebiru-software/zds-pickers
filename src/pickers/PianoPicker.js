import React from 'react'
import PropTypes from 'prop-types'
import { Piano as ReactPiano } from 'zds-react-piano'
import SoundfontProvider from '../other/SoundFontProvider'
import DefaultTooltip from '../other/DefaultTooltip'

const firstNote = 21
const lastNote = 108
const numNotes = lastNote - firstNote - 1

const whiteNotes = numNotes * 0.7 // approx

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

const PianoPicker = ({ height, width, ...rest }) => {
  const keyWidth = (width / whiteNotes) + 2
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
  onKeyMouseEnter,
  onKeyMouseLeave,
  soundfont,
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
      <PianoPicker
        disabled={isLoading}
        {...{
          height,
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

PianoPicker.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
}

WithProvider.propTypes = {
  format: PropTypes.oneOf(['mp3', 'ogg']),
  height: PropTypes.number.isRequired,
  hostname: PropTypes.string,
  instrumentName: PropTypes.string,
  onChange: PropTypes.func,
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
  onChange: undefined,
  onKeyMouseEnter: undefined,
  onKeyMouseLeave: undefined,
  soundfont: undefined, // 'MusyngKite',
  Tooltip: DefaultTooltip,
}

export default WithProvider
