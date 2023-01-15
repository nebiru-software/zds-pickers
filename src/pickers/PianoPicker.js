import React from 'react'
import PropTypes from 'prop-types'
import { MidiNumbers, Piano as ReactPiano } from 'react-piano'

const PianoPicker = ({ width }) => {
  // const firstNote = MidiNumbers.fromNote('c3')
  // const lastNote = MidiNumbers.fromNote('f5')
  const firstNote = 21
  const lastNote = 108
  console.log(width)

  return (
    <div>
      <ReactPiano
      // keyboardShortcuts={keyboardShortcuts}
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={(midiNumber) => {
        // Play a given note - see notes below
        }}
        stopNote={(midiNumber) => {
        // Stop playing a given note - see notes below
        }}
        width={width}
      />
    </div>
  )
}

PianoPicker.propTypes = {
  width: PropTypes.number,
}

PianoPicker.defaultProps = {
  width: 1000,
}

export default PianoPicker
