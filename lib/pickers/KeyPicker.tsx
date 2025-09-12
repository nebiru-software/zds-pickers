import { useCallback } from 'react'
import { OctavePlayer, type OctavePlayerProps } from '../other/OctavePlayer'
import { noSelection } from './Select'

type KeyPickerProps = Omit<OctavePlayerProps, 'selectedNotes' | 'onClick'> & {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  height?: number
  width?: number
  octave?: number
  startNote?:
    | 'C'
    | 'C#'
    | 'D'
    | 'D#'
    | 'E'
    | 'F'
    | 'F#'
    | 'G'
    | 'G#'
    | 'A'
    | 'A#'
    | 'B'
}

const KeyPicker = (props: KeyPickerProps) => {
  const {
    value,
    onChange,
    disabled = false,
    height = 100,
    width = 300,
    octave = 4,
    startNote = 'C',
    ...rest
  } = props

  const handleKeyClick = useCallback(
    (note: number) => {
      if (disabled) return
      onChange(note)
    },
    [disabled, onChange],
  )

  // Only highlight the note if it's a valid selection and within the octave range
  // Calculate the actual range based on startNote
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
  const startNoteIndex = baseNotes.indexOf(startNote)
  const octaveStart = 60 + (octave - 4) * 12 + startNoteIndex
  const octaveEnd = octaveStart + 11
  const shouldHighlight =
    value !== noSelection && value >= octaveStart && value <= octaveEnd

  return (
    <OctavePlayer
      {...rest}
      selectedNotes={shouldHighlight ? [value] : []}
      disabled={disabled}
      height={height}
      width={width}
      octave={octave}
      startNote={startNote}
      onClick={handleKeyClick}
    />
  )
}

KeyPicker.propTypes = {}

export { KeyPicker }
export type { KeyPickerProps }
