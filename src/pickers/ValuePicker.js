import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

const ValuePicker = forwardRef((props, inputRef) => {
  const { onChange, ...rest } = props

  return (
    <input
      ref={inputRef}
      type="number"
      onChange={({ target }) => {
        onChange(target.value)
      }}
      onFocus={({ target }) => {
        target.select()
      }}
      {...rest}
    />
  )
})

ValuePicker.propTypes = { onChange: PropTypes.func.isRequired }

export default ValuePicker
