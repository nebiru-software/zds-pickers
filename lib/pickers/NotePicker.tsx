import { forwardRef, useCallback, useMemo } from 'react'
import type { GroupBase, SelectInstance } from 'react-select'
import { Midi } from 'tonal'
import { type MapItem, type Mapping, emptyMapping } from 'zds-mappings'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'
import { assertRange } from '../utils'
import { Select } from './Select'
import type { Option, SelectProps } from './Select'

const { midiToNoteName } = Midi

const formattedMapEntry = ({ note, name }: MapItem) =>
  `${note} ${name.length ? '-' : ''} ${name}`
const formattedListEntry = (label: string, idx: number) => ({
  label,
  value: idx + 1,
})

type NotePickerProps = Omit<SelectProps<number>, 'options'> & {
  channel: number
  disabled?: boolean
  isMelodicMode?: boolean
  mapping?: Mapping
  onChange: (value: number) => void
}

type NotePickerRef = SelectInstance<
  Option<number>,
  false,
  GroupBase<Option<number>>
>

const NotePicker = forwardRef<
  SelectInstance<Option<number>, false, GroupBase<Option<number>>>,
  NotePickerProps
>((props, ref) => {
  const {
    channel,
    disabled = false,
    isMelodicMode = false,
    mapping,
    onChange,
    value: initialValue,
    ...rest
  } = props

  const options = useMemo(() => {
    if (isMelodicMode) {
      return emptyMapping()
        .map(({ note }) => {
          const midiNoteName = midiToNoteName(note, { sharps: false })
            .replace('b', '♭')
            .replace('#', '♯')
          return `${midiNoteName} (#${note})`
        })
        .map(formattedListEntry)
    }

    return (mapping || emptyMapping())
      .map(formattedMapEntry)
      .map(formattedListEntry)
  }, [isMelodicMode, mapping])

  const [value, setValue] = useStateWithDynamicDefault(initialValue)

  const handleChange = useCallback(
    (v: number | string) => {
      if (typeof v === 'string') return

      const possibleNoteNumber = assertRange(v, 128, 0)

      if (possibleNoteNumber > 0) {
        onChange(possibleNoteNumber)
      }
      setValue(v)
    },
    [onChange, setValue],
  )

  return (
    <Select
      {...rest}
      disabled={disabled}
      // isDisabled={disabled}
      onChange={handleChange}
      options={options}
      ref={ref}
      value={value}
    />
  )
})

export { NotePicker }

export type { NotePickerProps, NotePickerRef }
