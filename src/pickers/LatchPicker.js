import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import Select from './Select'

const options = [
  { value: 0, label: 'Momentary' },
  { value: 1, label: 'Latching' },
]

const LatchPicker = forwardRef((props, ref) => (
  <Select
    {...props}
    options={options}
    ref={ref}
  />
))

LatchPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export default LatchPicker
