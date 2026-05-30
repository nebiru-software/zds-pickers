import classNames from 'classnames'
import { useCallback } from 'react'
import { Note } from 'tonal'
import { OctavePlayer } from '../other/OctavePlayer'
import type { PianoProviderProps } from '../other/pianoTypes'
import type { NoteLabelRenderProps } from '../other/pianoTypes'
import { noSelection } from './Select'

const formatPitchName = (pitchClass: string) =>
  pitchClass.replace(/([A-G])b/g, '$1\u266D')

const NATURAL_LABEL_NUDGE_LEFT = new Set(['C', 'F'])
const NATURAL_LABEL_NUDGE_RIGHT = new Set(['E', 'B'])

const noteNameLabelRenderer = ({
  isAccidental,
  isActive,
  midiNumber,
}: NoteLabelRenderProps) => {
  const pitchClass = Note.pitchClass(Note.fromMidi(midiNumber) ?? '')
  const pitchName = formatPitchName(pitchClass)
  if (!pitchName) return null

  return (
    <div
      className={classNames(
        'ReactPiano__NoteLabel',
        'ReactPiano__NoteLabel--noteName',
        {
          'ReactPiano__NoteLabel--active': isActive,
          'ReactPiano__NoteLabel--accidental': isAccidental,
          'ReactPiano__NoteLabel--natural': !isAccidental,
          'ReactPiano__NoteLabel--nudgeLeft':
            !isAccidental && NATURAL_LABEL_NUDGE_LEFT.has(pitchClass),
          'ReactPiano__NoteLabel--nudgeRight':
            !isAccidental && NATURAL_LABEL_NUDGE_RIGHT.has(pitchClass),
        },
      )}>
      {pitchName}
    </div>
  )
}

type KeyPickerProps = Omit<
  PianoProviderProps,
  | 'className'
  | 'instrumentName'
  | 'octave'
  | 'onClick'
  | 'renderNoteLabel'
  | 'selectedNotes'
> & {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  height?: number
  showNoteNames?: boolean
  width?: number
  octave?: number
}

const KeyPicker = (props: KeyPickerProps) => {
  const {
    value,
    onChange,
    disabled = false,
    height = 100,
    showNoteNames = false,
    width = 300,
    octave = 4,
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
  // Octave 4 = C4 (60) to B4 (71)
  const octaveStart = 60 + (octave - 4) * 12
  const octaveEnd = octaveStart + 11
  const shouldHighlight =
    value !== noSelection && value >= octaveStart && value <= octaveEnd

  return (
    <OctavePlayer
      {...rest}
      className={showNoteNames ? 'ReactPiano--showNoteNames' : undefined}
      selectedNotes={shouldHighlight ? [value] : []}
      disabled={disabled}
      height={height}
      renderNoteLabel={showNoteNames ? noteNameLabelRenderer : undefined}
      width={width}
      octave={octave}
      onClick={handleKeyClick}
      instrumentName="acoustic_grand_piano"
    />
  )
}

export { KeyPicker }
export type { KeyPickerProps }
