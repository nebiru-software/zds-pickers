import React from 'react'
import PropTypes from 'prop-types'
import Input from 'material-ui/Input'

const ValuePicker = props => {
  const { className, value, onChange, autoFocus } = props
  const inputProps = {
    type: 'number',
    className,
    onChange: ({ target }) => {
      onChange(target.value)
    },
    value,
    autoFocus,
    disableUnderline: true,
  }
  return <Input {...inputProps} onFocus={e => e.target.select()} />
}

ValuePicker.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
}

ValuePicker.defaultProps = {
  className: '',
  autoFocus: false,
}

export default ValuePicker
