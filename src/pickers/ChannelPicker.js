import React from 'react'
import Select from 'react-select'
import { arraySequence } from '../utils'

const ChannelPicker = (props) => {
  const options = arraySequence(16).map(value => ({ value, label: value + 1 }))

  return (
    <Select
      // renderValue={val => `Channel ${val + 1}`}
      options={options}
      {...props}
    />
  )
}

export default ChannelPicker
