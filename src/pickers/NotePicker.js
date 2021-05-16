import { forwardRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { emptyMapping } from 'zds-mappings'
import { mappingShape } from '../shapes'
import { assertRange } from '../utils'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'
import Select from './Select'

const formattedMapEntry = ({ note, name }) => `${note} ${name.length ? '-' : ''} ${name}`
const formattedListEntry = (label, idx) => ({ label, value: idx + 1 })

const NotePicker = forwardRef((props, ref) => {
  const { channel, disabled, mapping, onChange, value: initialValue, ...rest } = props
  const options = (mapping || emptyMapping()).map(formattedMapEntry).map(formattedListEntry)
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
  mapping: PropTypes.arrayOf(mappingShape),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.number,
  channel: PropTypes.number.isRequired,
}

NotePicker.defaultProps = {
  disabled: false,
  mapping: undefined,
  value: undefined,
}

export default NotePicker
