import React from 'react'
import PropTypes from 'prop-types'

const ValuePicker = (props) => {
  // const inputRef = useRef()

  // const focus = () => {
  //   inputRef.focus()
  // }

  const { onChange, ...rest } = props

  return (
    <input
      // ref={inputRef}
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
}

ValuePicker.propTypes = { onChange: PropTypes.func.isRequired }

export default ValuePicker
