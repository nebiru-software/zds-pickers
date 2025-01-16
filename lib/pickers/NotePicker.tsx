import { forwardRef, useCallback, useMemo } from 'react'
import { Midi } from 'tonal'
import { type MapItem, type Mapping, emptyMapping } from 'zds-mappings'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'
import { assertRange } from '../utils.ts'
import type { SelectProps, SelectRef } from './Select'
import Select from './Select.tsx'

const { midiToNoteName } = Midi

const formattedMapEntry = ({ note, name }: MapItem) =>
  `${note} ${name.length ? '-' : ''} ${name}`
const formattedListEntry = (label: string, idx: number) => ({
  label,
  value: idx + 1,
})

type NotePickerProps = SelectProps & {
  channel: number
  disabled?: boolean
  isMelodicMode?: boolean
  mapping?: Mapping
  onChange: (value: number) => void
  value?: number
}

const NotePicker = forwardRef<SelectRef, NotePickerProps>((props, ref) => {
  const {
    channel,
    disabled,
    isMelodicMode,
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

export default NotePicker
