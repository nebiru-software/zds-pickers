import classNames from 'classnames'
import { useCallback, useMemo } from 'react'
import { Note } from 'tonal'
import { OctavePlayer } from '../other/OctavePlayer'
import { pitchClassLabel } from '../other/noteNames'
import type { PianoProviderProps } from '../other/pianoTypes'
import type { NoteLabelRenderProps } from '../other/pianoTypes'
import { noSelection } from './Select'

const NATURAL_LABEL_NUDGE_LEFT = new Set(['C', 'F'])
const NATURAL_LABEL_NUDGE_RIGHT = new Set(['E', 'B'])

const makeNoteNameLabelRenderer =
  (noteLabels?: readonly string[]) =>
  ({ isAccidental, isActive, midiNumber }: NoteLabelRenderProps) => {
    // Nudge classes key off the natural letter, which never varies with the
    // caller's spelling choice, so they read the default name rather than the
    // (possibly overridden) label.
    const pitchClass = Note.pitchClass(Note.fromMidi(midiNumber) ?? '')
    const pitchName = pitchClassLabel(midiNumber, noteLabels)
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
  /** Silences the piano sample a key click otherwise plays. */
  muted?: boolean
  /**
   * Chroma-indexed note names (index 0 = C) overriding the default flat
   * spelling — lets a caller label keys for a specific key/scale, where both
   * sharps and flats can be correct at once. Missing entries fall back.
   */
  noteLabels?: readonly string[]
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
    muted = false,
    noteLabels,
    showNoteNames = false,
    width = 300,
    octave = 4,
    ...rest
  } = props

  const renderNoteLabel = useMemo(
    () => makeNoteNameLabelRenderer(noteLabels),
    [noteLabels],
  )

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
      renderNoteLabel={showNoteNames ? renderNoteLabel : undefined}
      width={width}
      octave={octave}
      onClick={handleKeyClick}
      instrumentName={muted ? undefined : 'acoustic_grand_piano'}
    />
  )
}

export { KeyPicker }
export type { KeyPickerProps }
