import React, { forwardRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { emptyMapping } from 'zds-mappings'
import { Midi } from 'tonal'
import { mappingShape } from '../shapes'
import { assertRange } from '../utils'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'
import Select from './Select'

const { midiToNoteName } = Midi

const formattedMapEntry = ({ note, name }) => `${note} ${name.length ? '-' : ''} ${name}`
const formattedListEntry = (label, idx) => ({ label, value: idx + 1 })

const NotePicker = forwardRef((props, ref) => {
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
          return `${ midiNoteName} (#${note })`
        })
        .map(formattedListEntry)
    }

    return (mapping || emptyMapping())
      .map(formattedMapEntry)
      .map(formattedListEntry)
  }, [isMelodicMode, mapping])

  const [value, setValue] = useStateWithDynamicDefault(initialValue)

  const handleChange = useCallback((v) => {
    const possibleNoteNumber = assertRange(v, 128, 0)

    if (possibleNoteNumber > 0) {
      onChange(possibleNoteNumber)
    }
    setValue(v)
  }, [onChange, setValue])

  return (
    <Select
      {...rest}
      disabled={disabled}
      isDisabled={disabled}
      onChange={handleChange}
      options={options}
      ref={ref}
      value={value}
    />
  )
})

NotePicker.propTypes = {
  channel: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  isMelodicMode: PropTypes.bool,
  mapping: PropTypes.arrayOf(mappingShape),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
}

NotePicker.defaultProps = {
  disabled: false,
  isMelodicMode: false,
  mapping: undefined,
  value: undefined,
}

export default NotePicker
