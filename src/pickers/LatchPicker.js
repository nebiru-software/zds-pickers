import React from 'react'
import Select from 'react-select'

const options = [
  //
  { value: 0, label: 'Momentary' },
  { value: 1, label: 'Latching' },
]

const LatchPicker = props => (
  <Select
    options={options}
    {...props}
  />
)

export default LatchPicker
